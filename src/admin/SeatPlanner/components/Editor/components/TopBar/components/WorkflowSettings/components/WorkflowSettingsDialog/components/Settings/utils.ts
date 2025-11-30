import { WorkflowProps } from "@src/admin/SeatPlanner/components/Editor/components/Workflow/types";

export interface MediaFrameImageProps {
    id: number;
    sizes: {
        full: {
            height: number,
            width: number,
            url: string
        },
        large?: {
            height: number,
            width: number,
            url: string
        },
        medium?: {
            height: number,
            width: number,
            url: string
        },
        thumbnail?: {
            height: number,
            width: number,
            url: string
        }
    },
    caption: string;
    url: string,
    width: number,
    height: number
}

export const mediaFrame = (args: {
    title?: string;
    buttonText?: string;
    libraryType?: string;
    multiple?: boolean;
}) : Promise<MediaFrameImageProps[] | void> => {

    return new Promise((resolve) => {

        const mediaFrame = window.wp.media({
            button: { text: args.buttonText },
            library: { type: args.libraryType },
            frame: 'select',
            title: args.title,
            multiple: args.multiple
        });

        mediaFrame.open();

        mediaFrame.on('select', () => {
            const attachments = mediaFrame.state().get('selection').toJSON();
            return resolve(attachments);
        });

    });

};

export const hasBackgroundImage = (workflow: WorkflowProps) => {
    return workflow.backgroundImage !== undefined; 
}