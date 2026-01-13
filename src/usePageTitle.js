import { useEffect } from "react";

const usePageTitle = (title) => {
    useEffect(() => {
        const isDev = window.location.hostname === "localhost";
        const prefix = isDev ? "Dev - " : "";
        document.title = title ? `${prefix}${title} - Wishlist` : `${prefix}Wishlist`;
    }, [title]);
};

export default usePageTitle;
