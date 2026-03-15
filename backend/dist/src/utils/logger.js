export const logger = {
    info(message, meta) {
        console.info(message, meta ?? '');
    },
    error(message, meta) {
        console.error(message, meta ?? '');
    },
};
