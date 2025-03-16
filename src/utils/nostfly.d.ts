// nostfly.d.ts
declare module 'nostfly/src/nostfly' {
    // Provide an any type for now, or you can define more specific types if you know the structure
    class Nostfly {
        constructor(config: {
            style: string;
            position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
            header: string;
            content: string;
            delay: number;
        });

        // If the Nostfly class has any methods or properties you want to access, add them here
    }

    export default Nostfly;
}
