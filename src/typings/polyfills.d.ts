interface Navigation {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate: (page: string, params?: any) => void;
    goBack: () => void;
    getState: () => {
        routeNames: string[]
    };
    addListener: (event: string, action: () => void) => void;
}
