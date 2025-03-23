export interface IBaseProduct {
  id: string;
  title: string;
  price: number | null;
}

export interface ICatalogProduct extends IBaseProduct {
  category: string;
  image: string;
}

export interface IFullProduct extends ICatalogProduct {
  description: string;
}

export class Product implements IFullProduct {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly price: number | null,
    public readonly category: string,
    public readonly image: string
  ) {}
}