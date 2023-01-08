export type GetPagesRequest = {
    pageId: string;
};

export type GetDatabaseResponse = {
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

export type GetPageResponse = {
    // page: {
    properties: {
        Name: {
            title: string;
        };
    };
    // };
};

export type GetBlocksResponse = {
    id: string;
    has_children: boolean;
    type: string;
    content: BlockType | null;
};

type BlockType = {
    [key: string]: { rich_text: string } | null;
    paragraph: {
        rich_text: string;
    };
    bulleted_list_item: {
        rich_text: string;
    };
};
