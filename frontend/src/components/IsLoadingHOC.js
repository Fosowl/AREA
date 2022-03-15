import React, { useState } from 'react'
import Lottie from 'react-lottie';
import { Animations } from 'Theme';

const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: Animations.loading,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const IsLoadingHOC = (WComponent) => {
    const HOC = (props) => {
        const [isLoading, setLoading] = useState(true)

        const setLoadingState = isComponentLoading => {
            setLoading(isComponentLoading)
        }

        return (
            <>
                <WComponent {...props} setIsLoading={setLoadingState} isLoading={isLoading} />
                { isLoading && <Lottie options={defaultOptions} height={200} width={200} /> }
            </>
        )
    }

    return HOC
}

export default IsLoadingHOC