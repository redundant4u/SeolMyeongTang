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
            title: [
                {
                    plain_text: string;
                }
            ];
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
    rich_text: [
        {
            type: string;
            annotation: [];
            plain_text: string;
            href: string;
        }
    ];
    title?: string;
    url?: string;
    type?: string;
    file?: { url: string };
    external?: { url: string };
    caption?: [
        {
            plain_text: string;
        }
    ];
    checked?: boolean;
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
