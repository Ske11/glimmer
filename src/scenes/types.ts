export type DrawFn = (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
export type SceneFactory = () => DrawFn;
