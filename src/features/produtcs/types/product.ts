export interface Product {
  id: number;
  categoria_id: number | null;
  nome: string;
  descricao: string | null;
  preco: number;
  preco_compra: number;
  estoque: number;
  estoque_minimo: number;
  unit: string | null;
  imagem: string | null;
  codigo_barras: string | null;
  ativo: number;
  data_cadastro: string;
}

export interface CreateProductDTO {
  categoria_id?: number | null;
  nome: string;
  descricao?: string | null;
  preco: number;
  preco_compra?: number;
  estoque?: number;
  estoque_minimo?: number;
  unit?: string | null;
  imagem?: string | null;
  codigo_barras?: string | null;
}

export interface UpdateProductDTO {
  categoria_id?: number | null;
  nome?: string;
  descricao?: string | null;
  preco?: number;
  preco_compra?: number;
  estoque?: number;
  estoque_minimo?: number;
  unit?: string | null;
  imagem?: string | null;
  codigo_barras?: string | null;
  ativo?: number;
}
