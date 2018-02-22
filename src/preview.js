export default `<!doctype html>
<html>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <meta name="HandheldFriendly" content="True" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link href="https://raw.githubusercontent.com/TryGhost/Ghost-Android/0be587a56f017e21dff2568811956267653289ff/app/src/main/assets/css/defer.css"
    />
    <link href="https://raw.githubusercontent.com/TryGhost/Ghost-Android/0be587a56f017e21dff2568811956267653289ff/app/src/main/assets/css/main.css"
    />

    <script>
        (function () {
            window.onclick = function (e) {
                e.preventDefault();
                window.postMessage(e.target.href);
                e.stopPropagation()
            }
        }());
    </script>
</head>

<body>
    <main class="content" style="overflow-x: hidden;">
        <article class="post">

            <header>
                <h1 class="post-title">
                    <!-- post title goes here -->
                    $$title
                </h1>
            </header>

            <section class="post-content">
                <!-- post preview content goes here -->
                $$content
            </section>

        </article>
    </main>
</body>

</html>`;
