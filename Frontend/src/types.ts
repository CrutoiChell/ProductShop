export interface IUserProfile {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    password: string;
    address: string;
    role: 'user' | 'admin';
}

export interface IOrder {
    id: number;
    products?: IProduct[]
    user_id: number;
    payments: 'credit_card' | 'cash';
    type: 'delivery' | 'pickup';
    delivery_date: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    created_at: string;
    total?: string
}

export interface IProduct {
    id: number;
    title: string;
    description: string;
    img_url: string;
    price: number;
    count: number;
    category: string;
    brand: string;
    discount: number;
    composition: string;
}

export interface ICartProduct {
    id: number;
    title: string;
    brand: string;
    category: string;
    composition: string;
    count: number;
    description: string;
    discount: number;
    img_url: string;
    price: number;
    quantity: number;
}

export interface IFav {
    id?: number,
    user_id: number,
    product_id: number,
    brand?: string,
    category?: string,
    composition?: string,
    count?: number,
    description?: string,
    discount?: string,
    img_url?: string,
    price?: string,
    title?: string,
}

export interface IFilterItem {
    checked: boolean,
    id: string,
    name: string
}