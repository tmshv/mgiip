function script(account: number | string) {
    return `
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(${account}, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
        });
    `
}

export type YandexMetrikaProps = {
    counter: number | string
    noscript?: false
}

const YandexMetrika: React.FC<YandexMetrikaProps> = ({ counter, noscript = false }) => {
    if (noscript) {
        return (
            <noscript>
                <div>
                    <img
                        src={`https://mc.yandex.ru/watch/${counter}`}
                        style={{
                            position: "absolute",
                            left: "-9999px",
                        }}
                        alt={""}
                    />
                </div>
            </noscript>
        )
    }

    return <script type={"text/javascript"} dangerouslySetInnerHTML={{ __html: script(counter) }} />
}

export default YandexMetrika
