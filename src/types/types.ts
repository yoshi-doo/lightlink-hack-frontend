export interface TokenDetailsApi {
  items: Item[];
}

export interface Item {
  total: Total;
  token: Token;
}

export interface Total {
  token_id: string;
}

export interface Token {
  address: string;
}
