import type { FC } from 'hono/jsx'

export const Layout: FC = (props) => {
    return (
        <html>
            <head>
                <title>Sweet home</title>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script src="https://kit.fontawesome.com/7942546cd6.js" crossorigin="anonymous"></script>
                <link rel="stylesheet" href="/static/simple.min.css" />
                <link rel="stylesheet" href="/static/style.css" />
            </head>
            <body>{props.children}</body>
        </html>
    )
}
