import { registerEnumType } from '@nestjs/graphql';

export enum ClotheCategory {
  T_SHIRT = "T_SHIRT",
  HOODIE = "HOODIE",
  SHORTS = "SHORTS",
  PANTS = "PANTS",
  SHOES = "SHOES",
  GLOVES = "GLOVES",
  SOCKS = "SOCKS",
  JACKET = "JACKET",
  SPORTS_BRA = "SPORTS_BRA",
}
registerEnumType(ClotheCategory, {
  name: 'ClotheCategory',
});

export enum ClotheStatus {
  ACTIVE = "ACTIVE",
  SOLD = "SOLD",
  DELETE = "DELETE",
}
registerEnumType(ClotheStatus, {
  name: 'ClotheStatus',
});

export enum ClotheMaterial {
  COTTON = "COTTON",
  POLYESTER = "POLYESTER",
  NYLON = "NYLON",
  SPANDEX = "SPANDEX",
  FLEECE = "FLEECE",
  MESH = "MESH",
}
registerEnumType(ClotheMaterial, {
  name: 'ClotheMaterial',
});

export enum ClotheSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}
registerEnumType(ClotheSize, {
  name: 'ClotheSize',
});

export enum ClotheGender {
  MEN = "MEN",
  WOMEN = "WOMEN",
  UNISEX = "UNISEX",
}
registerEnumType(ClotheGender, {
  name: 'ClotheGender',
});

export enum ClotheColor {
  BLACK = "BLACK",
  WHITE = "WHITE",
  GRAY = "GRAY",
  RED = "RED",
  BLUE = "BLUE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  NAVY = "NAVY",
  PINK = "PINK",
}
registerEnumType(ClotheColor, {
  name: 'ClotheColor',
});