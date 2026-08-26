export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text' | 'awards';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

export interface CardItem {
    slug?: string;
    show_detail_page?: boolean;
    title: string;
    author?: string;
    show_author?: boolean;
    subtitle?: string;
    date?: string;
    content?: string;
    details?: string;
    details_source?: string;
    show_contents?: boolean;
    tags?: string[];
    link?: string;
    links?: Array<{ label: string; url: string }>;
    image?: string;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
}

export interface AwardPageConfig extends BasePageConfig {
    type: 'awards';
    items: AwardItem[];
}

export interface AwardItem {
    title: string;
    organizations?: AwardOrganization[];
    date?: string;
    content?: string;
    symbol?: 'academic-cap' | 'document' | 'microscope' | 'trophy' | 'users';
    link?: string;
}

export interface AwardOrganization {
    name: string;
    icon?: string;
    link?: string;
}

export interface HighlightItem {
    organization: string;
    role: string;
    year?: string;
    icon?: string;
    link?: string;
}
