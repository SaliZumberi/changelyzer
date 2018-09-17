export interface Change {
  index?: number;
  unvectorized?: string;
  vectorized: string;
  cluster?: number;
  count?: number;
  what?: number;
  where?: number;
}
