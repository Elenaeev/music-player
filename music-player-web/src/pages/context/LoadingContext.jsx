import { createContext, useState } from "react";

export const LoadingContext = createContext();

export function LoadingProvider({ children }) {
    const [loading, setLoading] = useState(false);

    const states = {
        loading, setLoading
    }

    return(
        <LoadingContext.Provider value={states}>
            {children}
        </LoadingContext.Provider>
    )
}