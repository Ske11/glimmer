use tauri::{
    menu::{Menu, MenuItem, Submenu},
    webview::WebviewWindowBuilder,
    Manager,
    RunEvent,
};
use std::sync::atomic::{AtomicU32, Ordering};

static COUNTER: AtomicU32 = AtomicU32::new(0);

fn widget_sizes(widget_type: &str) -> (f64, f64, f64, f64) {
    match widget_type {
        "clock"     => (180.0, 185.0, 175.0, 180.0),
        "todo"      => (220.0, 240.0, 180.0, 158.0),
        "quote"     => (215.0, 220.0, 185.0, 216.0),
        "countdown" => (175.0, 215.0, 160.0, 210.0),
        "memo"      => (210.0, 190.0, 185.0, 138.0),
        _           => (200.0, 200.0, 160.0, 140.0),
    }
}

/// On macOS, make window appear on all Spaces and stay stationary
#[cfg(target_os = "macos")]
fn configure_widget_behavior(window: &tauri::WebviewWindow) {
    let ns_window = window.ns_window();
    if let Ok(ptr) = ns_window {
        unsafe {
            use objc2_app_kit::NSWindow;
            use objc2_app_kit::NSWindowCollectionBehavior;
            let ns_win: &NSWindow = &*(ptr as *const NSWindow);
            // canJoinAllSpaces: appear on all desktops
            // stationary: don't move when spaces switch
            // fullScreenAuxiliary: stay visible in full screen
            ns_win.setCollectionBehavior(
                NSWindowCollectionBehavior::CanJoinAllSpaces
                | NSWindowCollectionBehavior::Stationary
                | NSWindowCollectionBehavior::FullScreenAuxiliary
            );
        }
    }
}

/// Bring all widget windows to front
fn show_all_widgets(app: &tauri::AppHandle) {
    for (_, window) in app.webview_windows() {
        let _ = window.set_focus();
    }
}

fn create_widget_window(app: &tauri::AppHandle, widget_type: &str) {
    let id = COUNTER.fetch_add(1, Ordering::Relaxed);
    let label = format!("widget_{}", id);
    let (w, h, min_w, min_h) = widget_sizes(widget_type);
    let url_path = format!("index.html?type={}&wid={}", widget_type, label);

    let builder = WebviewWindowBuilder::new(
        app,
        &label,
        tauri::WebviewUrl::App(url_path.into()),
    )
    .title("Glimmer")
    .inner_size(w, h)
    .min_inner_size(min_w, min_h)
    .decorations(false)
    .transparent(true)
    .always_on_top(false)
    .skip_taskbar(true)
    .resizable(true)
    .visible(true);

    match builder.build() {
        Ok(window) => {
            eprintln!("[Glimmer] Widget {} created", label);
            #[cfg(target_os = "macos")]
            configure_widget_behavior(&window);
        }
        Err(e) => eprintln!("[Glimmer] Failed to create widget: {}", e),
    }
}

#[tauri::command]
fn create_widget(app: tauri::AppHandle, widget_type: String) {
    create_widget_window(&app, &widget_type);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_widget])
        .setup(|app| {
            eprintln!("[Glimmer] Setup starting...");

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            let clock = MenuItem::with_id(app, "new_clock", "时钟", true, None::<&str>)?;
            let todo = MenuItem::with_id(app, "new_todo", "待办", true, None::<&str>)?;
            let quote = MenuItem::with_id(app, "new_quote", "心语", true, None::<&str>)?;
            let countdown = MenuItem::with_id(app, "new_countdown", "倒计时", true, None::<&str>)?;
            let memo = MenuItem::with_id(app, "new_memo", "便签", true, None::<&str>)?;

            let new_submenu = Submenu::with_items(
                app,
                "新建组件",
                true,
                &[&clock, &todo, &quote, &countdown, &memo],
            )?;

            let show = MenuItem::with_id(app, "show_all", "显示所有组件", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&new_submenu, &show, &quit])?;
            eprintln!("[Glimmer] Menu built OK");

            if let Some(tray) = app.tray_by_id("main") {
                tray.set_menu(Some(menu))?;
                tray.on_menu_event(|app_handle, event| {
                    match event.id.as_ref() {
                        "new_clock"     => create_widget_window(app_handle, "clock"),
                        "new_todo"      => create_widget_window(app_handle, "todo"),
                        "new_quote"     => create_widget_window(app_handle, "quote"),
                        "new_countdown" => create_widget_window(app_handle, "countdown"),
                        "new_memo"      => create_widget_window(app_handle, "memo"),
                        "show_all"      => show_all_widgets(app_handle),
                        "quit"          => app_handle.exit(0),
                        _ => {}
                    }
                });
                eprintln!("[Glimmer] Tray icon configured OK");
            } else {
                eprintln!("[Glimmer] ERROR: tray icon 'main' not found!");
            }

            eprintln!("[Glimmer] Setup complete!");
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app, event| {
            if let RunEvent::ExitRequested { api, .. } = event {
                api.prevent_exit();
            }
        });
}
