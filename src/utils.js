export const createPageUrl = (page) => {
    if (page.toLowerCase() === 'home') return '/';
    return '/' + page.toLowerCase();
};
