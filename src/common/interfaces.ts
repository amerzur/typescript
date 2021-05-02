export interface Category {
  id: number;
  name: string;
}

export interface Video {
  id: number;
  catIds: number[];
  name: string;
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface ProcessedVideo {
  id: number;
  name: string;
  author: string;
  categories: string[];
  format: Format;
  realeaseDate: Date;
}

// created class because i want to initilize them by default 
export class Format {
  [key: string]: Resolution
}

export class Resolution {
  res: string;
  size: number;
  constructor() {
    this.res = "1080p"
    this.size = 1000
  }

}
