


//  Interfaz de como será los atributos de un juego
export interface Game {
    id: number;
    title: string;
    description: string;
    price: number;
    discount: number;
    image: string;
    category: 'strategy' | 'party' | 'classic' | 'family'; 
}