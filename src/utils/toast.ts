// toast.ts

// Make sure to import the Nostfly library if it's an external one or initialized before using this
import "nostfly";
import Nostfly from "nostfly/src/nostfly";

// Define the interface for the toast configuration
interface ToastConfig {
    style: string;
    header: string; // accept html
    content: string; // accept html
    delay?: number;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Create a function to display a generic toast notification
function showToast({ style, header, content, delay = 4000, position = 'bottom-right' }: ToastConfig): Nostfly {
    return new Nostfly({
        style: style,
        position: position,
        header: header, // accept html
        content: content, // accept html
        delay: delay
    });
}

// Predefined functions for specific toast styles
function showToastWarning(title: string, message: string): void {
    showToast({
        style: 'warning',
        header: title,
        content: message
    });
}

function showToastSuccess(title: string, message: string): void {
    showToast({
        style: 'success',
        header: title,
        content: message
    });
}

function showToastError(title: string, message: string): void {
    showToast({
        style: 'error',
        header: title,
        content: message
    });
}

function showToastAttention(title: string, message: string): void {
    showToast({
        style: 'attention',
        header: title,
        content: message
    });
}

function showToastNotify(title: string, message: string): void {
    showToast({
        style: 'notify',
        header: title,
        content: message
    });
}

function showToastNote(title: string, message: string): void {
    showToast({
        style: 'note',
        header: title,
        content: message
    });
}

// Export the toast functions to be used in other files
export {
    showToastWarning,
    showToastSuccess,
    showToastError,
    showToastAttention,
    showToastNotify,
    showToastNote
};
