export type Database = {
    results: [
        {
            id: string;
            properites: {
                Name: {
                    title: string;
                };
            };
            last_edited_time: string;
        }
    ];
};

export type Page = {
    properties: {
        Name: {
            title: [PlainText];
        };
    };
};

export type Block = {
    id: string;
    has_children: boolean;
    type: BlockType;
    parent: {
        page_id?: string;
        block_id?: string;
    };
    children: Block[] | null;
};

export type BlockValue = {
    children?: Block[];
    rich_text: [RichText];
    title?: string;
    url?: string;
    type?: string;
    file?: { url: string };
    external?: { url: string };
    caption?: [PlainText];
    checked?: boolean;
};

export type RichText = {
    type: string;
    text: {
        content: string;
        link: {
            url: string;
        };
    };
    annotations: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color: string;
    };
    plain_text: string;
    href: string;
};

export type PlainText = {
    plain_text: string;
};

type BlockType =
    | 'paragraph'
    | 'heading_1'
    | 'heading_2'
    | 'heading_3'
    | 'bulleted_list_item'
    | 'numbered_list_item'
    | 'to_do'
    | 'toggle'
    | 'child_page'
    | 'image'
    | 'divider'
    | 'quote'
    | 'code'
    | 'file'
    | 'bookmark';
