export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Artist {
    id: string;
    name: string;
}

export interface Album {
    id: string;
    name: string;
    images: Image[];
    artists: Artist[];
    release_date: string;
}

export interface Track {
    id: string;
    name: string;
    album: Album;
    artists: Artist[];
    duration_ms: number;
    preview_url: string;
    uri: string;
}

export interface SearchResponse {
    tracks?: {
        items: Track[];
    };
    albums?: {
        items: Album[];
    };
    artists?: {
        items: Artist[];
    };
}
