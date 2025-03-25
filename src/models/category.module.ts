export class Category {
  constructor(
    public code: string,
    public name: string,
    public link: string,
    public image: string | null = null,
  ) { }
}