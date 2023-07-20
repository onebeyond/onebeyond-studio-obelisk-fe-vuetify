export type NotificationType = "success" | "info" | "warning" | "error";

export interface ToastOptions {
    id: number;
    message: string;
    color: string;
    isShow: boolean;
    position: number;
    closeOnContentClick: boolean;
    timeout: number;
    location: string;
}

export type ShowMethod = (title: string, message: string, type: NotificationType, toastOptions?: ToastOptions) => void;
