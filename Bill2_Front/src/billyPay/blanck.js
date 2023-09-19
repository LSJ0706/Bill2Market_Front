import React, {useEffect} from 'react'

function BlankPage() {
    const close = () => {
        window.close()
    }

    useEffect(() => {
            close()
        }
        )
    return(
        <div>
        </div>
    )
}

export default BlankPage;