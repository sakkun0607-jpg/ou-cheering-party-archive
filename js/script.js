const newcomerPageLink = document.createElement("a");
newcomerPageLink.className = "site-newcomer-link";
newcomerPageLink.href = "welcome.html";
newcomerPageLink.innerHTML = '<span>新入生の方へ</span><span aria-hidden="true">↗</span>';
newcomerPageLink.setAttribute("aria-label", "新入生・入団希望の皆様へのページへ");
if (!window.location.pathname.endsWith("/welcome.html")) {
    document.body.appendChild(newcomerPageLink);
}

const SUPABASE_URL =
    "https://minorohtjrqsjgpvrarj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Ob0a5g0vMTgawdFvrWnAHw_eaycrm5i";

let supabaseClient = null;
const needsSupabase = Boolean(
    document.getElementById("activityReports") ||
    document.getElementById("welcomePosts")
);

if (window.supabase) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

} else if (needsSupabase) {

    console.error(
        "Supabaseを使うページでライブラリが読み込まれていません。"
    );

}


async function isSiteAdmin() {
    if (!supabaseClient) return false;
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError || !session) return false;
    const { data, error } = await supabaseClient
        .from("site_admins")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();
    if (error) throw error;
    return Boolean(data);
}

async function signInSiteAdmin(email, password) {
    if (!supabaseClient) throw new Error("Supabaseに接続できません。");
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    try {
        if (await isSiteAdmin()) return true;
    } catch (error) {
        await supabaseClient.auth.signOut();
        throw error;
    }
    await supabaseClient.auth.signOut();
    throw new Error("このアカウントには管理権限がありません。");
}

async function signOutSiteAdmin() {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
}

function isActivityMetadataColumnError(error) {
    return error?.code === "42703" || error?.code === "PGRST204" ||
        /column .*?(category|tags)|schema cache/i.test(error?.message || "");
}

function isActivityPinnedColumnError(error) {
    return error?.code === "42703" || error?.code === "PGRST204" ||
        /column .*?is_pinned|schema cache/i.test(error?.message || "");
}



const menuButton =
    document.getElementById("menuButton");

const menu =
    document.getElementById("menu");


if (menuButton && menu) {

    menuButton.setAttribute(
        "aria-controls",
        "menu"
    );

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    menuButton.setAttribute(
        "aria-label",
        "メニューを開く"
    );


    menuButton.addEventListener(
        "click",
        function () {

            const isOpen =
                menu.classList.toggle("open");


            menuButton.textContent =
                isOpen ? "×" : "☰";


            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            menuButton.setAttribute(
                "aria-label",
                isOpen
                    ? "メニューを閉じる"
                    : "メニューを開く"
            );

        }
    );

}



document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.ctrlKey &&
            !event.altKey &&
            !event.shiftKey &&
            typeof event.key === "string" &&
            event.key.toLowerCase() === "w"
        ) {
            event.preventDefault();
            event.stopPropagation();

            window.location.href =
                "index.html";

        }

    },
    { capture: true }
);



const timelineItems =
    document.querySelectorAll(
        ".timeline-item"
    );


const observer =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(
                function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "show"
                        );

                    }

                }
            );

        },
        {
            threshold: 0.15
        }
    );


timelineItems.forEach(
    function (item) {

        observer.observe(item);

    }
);



const homePartCards =
    document.querySelectorAll(
        ".home-parts-reveal .home-part-panel"
    );


homePartCards.forEach(
    function (card) {

        observer.observe(card);

    }
);



const hero =
    document.querySelector(".hero");


if (hero) {

    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 80) {

                hero.classList.add(
                    "scrolled"
                );

            } else {

                hero.classList.remove(
                    "scrolled"
                );

            }

        }
    );

}



const songItems =
    document.querySelectorAll(
        ".song-item"
    );


songItems.forEach(
    function (song) {

        song.addEventListener(
            "click",
            function () {

                const lyricsBoard =
                    song.nextElementSibling;


                if (!lyricsBoard) {
                    return;
                }


                if (
                    lyricsBoard.classList.contains(
                        "open"
                    )
                ) {

                    lyricsBoard.style.maxHeight =
                        null;

                    lyricsBoard.classList.remove(
                        "open"
                    );

                    song.classList.remove(
                        "active"
                    );

                } else {

                    lyricsBoard.classList.add(
                        "open"
                    );

                    lyricsBoard.style.maxHeight =
                        lyricsBoard.scrollHeight +
                        120 +
                        "px";

                    song.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);



if (menuButton && menu) {

    const menuLinks =
        document.querySelectorAll(
            ".menu a"
        );


    function updateMenuTextColor() {

        if (
            !menu.classList.contains("open")
        ) {

            return;

        }


        menu.style.visibility =
            "hidden";


        const menuRect =
            menu.getBoundingClientRect();


        const x =
            menuRect.left - 10;


        const y =
            window.innerHeight / 2;


        const backgroundElement =
            document.elementFromPoint(
                x,
                y
            );


        menu.style.visibility =
            "";


        if (!backgroundElement) {
            return;
        }


        const background =
            getComputedStyle(
                backgroundElement
            ).backgroundColor;


        const match =
            background.match(
                /rgba?\((\d+),\s*(\d+),\s*(\d+)/
            );


        if (!match) {
            return;
        }


        const r =
            Number(match[1]);


        const g =
            Number(match[2]);


        const b =
            Number(match[3]);


        const brightness =
            (
                r * 299 +
                g * 587 +
                b * 114
            ) / 1000;


        if (brightness > 150) {

            menuLinks.forEach(
                function (link) {

                    link.style.color =
                        "black";

                }
            );

        } else {

            menuLinks.forEach(
                function (link) {

                    link.style.color =
                        "white";

                }
            );

        }

    }


    menuButton.addEventListener(
        "click",
        function () {

            setTimeout(
                function () {

                    updateMenuTextColor();

                },
                10
            );

        }
    );


    window.addEventListener(
        "scroll",
        function () {

            updateMenuTextColor();

        }
    );


    window.addEventListener(
        "resize",
        function () {

            updateMenuTextColor();

        }
    );

}



const activityReports =
    document.getElementById(
        "activityReports"
    );

const activityFilterInputs =
    document.querySelectorAll('input[name="activityFilter"]');
const activityFilterOptions = document.querySelector(".activity-filter-options");

const activityFilterClear =
    document.getElementById("activityFilterClear");

let allActivityReports = [];

function renderFilteredActivityReports() {
    if (!activityReports) return;

    const selectedFilters = Array.from(document.querySelectorAll('input[name="activityFilter"]'))
        .filter((input) => input.checked)
        .map((input) => input.value);
    const selectedCategories = selectedFilters
        .filter((filter) => filter.startsWith("category:"))
        .map((filter) => filter.slice("category:".length));
    const selectedTags = selectedFilters
        .filter((filter) => filter.startsWith("tag:"))
        .map((filter) => filter.slice("tag:".length));

    const filteredReports = selectedFilters.length === 0
        ? allActivityReports
        : allActivityReports.filter((report) => {
            const categoryMatches = selectedCategories.length === 0 || selectedCategories.includes(report.category);
            const tags = Array.isArray(report.tags) ? report.tags : [];
            const tagsMatch = selectedTags.length === 0 || selectedTags.every((tag) => tags.includes(tag));
            return categoryMatches && tagsMatch;
        });

    activityReports.replaceChildren();

    if (filteredReports.length === 0) {
        const empty = document.createElement("p");
        empty.className = "activity-filter-no-results";
        empty.textContent = selectedFilters.length
            ? "選択した分類・ラベルの記事はありません。"
            : "現在、掲載内容を準備しています。";
        activityReports.appendChild(empty);
        return;
    }

    filteredReports.forEach((report) => {
        activityReports.appendChild(createActivityArticle(report));
    });
}

activityFilterInputs.forEach((input) => {
    input.addEventListener("change", renderFilteredActivityReports);
});

function addActivityTagFilter(tag) {
    if (!activityFilterOptions || !tag) return;
    const value = `tag:${tag}`;
    const existing = activityFilterOptions.querySelectorAll('input[name="activityFilter"]');
    if (Array.from(existing).some((input) => input.value === value)) return;

    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "activityFilter";
    input.value = value;
    input.addEventListener("change", renderFilteredActivityReports);
    label.append(input, document.createTextNode(tag));
    activityFilterOptions.appendChild(label);
}

if (activityFilterClear) {
    activityFilterClear.addEventListener("click", () => {
        document.querySelectorAll('input[name="activityFilter"]')
            .forEach((input) => { input.checked = false; });
        renderFilteredActivityReports();
    });
}


const editActivityButton =
    document.getElementById(
        "editActivityButton"
    );


const activityAdminOverlay =
    document.getElementById(
        "activityAdminOverlay"
    );


const activityAdminClose =
    document.getElementById(
        "activityAdminClose"
    );


const activityPasswordArea =
    document.getElementById(
        "activityPasswordArea"
    );


const activityEmail =
    document.getElementById("activityEmail");


const activityPassword =
    document.getElementById(
        "activityPassword"
    );


const activityPasswordButton =
    document.getElementById(
        "activityPasswordButton"
    );


const activityPasswordError =
    document.getElementById(
        "activityPasswordError"
    );


const activityEditorArea =
    document.getElementById(
        "activityEditorArea"
    );


const activityTitle =
    document.getElementById(
        "activityTitle"
    );

const activityCategory = document.getElementById("activityCategory");
const activitySportsOptions = document.getElementById("activitySportsOptions");
const activityCustomTagInput = document.getElementById("activityCustomTag");
const activityCustomTags = document.getElementById("activityCustomTags");
const activityAddCustomTag = document.getElementById("activityAddCustomTag");

function activityTagInputs() {
    return document.querySelectorAll('input[name="activityTag"]');
}

function selectedActivityTags() {
    return Array.from(activityTagInputs())
        .filter((input) => input.checked)
        .map((input) => input.value);
}

function setActivityTags(tags = []) {
    const builtInTags = new Set([
        "アイスホッケー", "アメフト", "男子ラクロス", "女子ラクロス",
        "準硬式野球", "硬式野球", "その他", "七大戦"
    ]);
    tags.filter((tag) => !builtInTags.has(tag))
        .forEach((tag) => addCustomActivityTag(tag, false));
    activityTagInputs().forEach((input) => {
        input.checked = tags.includes(input.value);
    });
}

function addCustomActivityTag(tag, selected = true) {
    if (!activityCustomTags || !tag) return;
    const normalizedTag = tag.trim().replace(/\s+/g, " ");
    if (!normalizedTag || normalizedTag.length > 30) return;
    let input = Array.from(activityTagInputs()).find((item) => item.value === normalizedTag);
    if (!input) {
        const label = document.createElement("label");
        input = document.createElement("input");
        input.type = "checkbox";
        input.name = "activityTag";
        input.value = normalizedTag;
        label.append(input, document.createTextNode(normalizedTag));
        activityCustomTags.appendChild(label);
    }
    input.checked = selected;
    addActivityTagFilter(normalizedTag);
}

if (activityAddCustomTag && activityCustomTagInput) {
    activityAddCustomTag.addEventListener("click", () => {
        const tag = activityCustomTagInput.value.trim();
        if (!tag) return;
        if (Array.from(activityTagInputs()).some((input) => input.value === tag)) {
            activityPublishMessage.textContent = "既存のラベルです。チェックボックスから選択してください。";
            return;
        }
        addCustomActivityTag(tag);
        activityCustomTagInput.value = "";
    });
}

function updateActivityTagVisibility() {
    if (!activitySportsOptions || !activityCategory) return;
    const showSports = activityCategory.value === "試合応援";
    activitySportsOptions.hidden = !showSports;
    if (!showSports) {
        activitySportsOptions.querySelectorAll('input[name="activityTag"]')
            .forEach((input) => { input.checked = false; });
    }
}

if (activityCategory) {
    activityCategory.addEventListener("change", updateActivityTagVisibility);
    updateActivityTagVisibility();
}


const activityThumbnailFile =
    document.getElementById(
        "activityThumbnailFile"
    );


const activityThumbnailStatus =
    document.getElementById(
        "activityThumbnailStatus"
    );


const activityBody =
    document.getElementById(
        "activityBody"
    );


const activityPublishButton =
    document.getElementById(
        "activityPublishButton"
    );


const activityCancelEditButton =
    document.getElementById(
        "activityCancelEditButton"
    );


const activityPublishMessage =
    document.getElementById(
        "activityPublishMessage"
    );


const activityAdminReports =
    document.getElementById(
        "activityAdminReports"
    );



async function loadActivityReports() {

    if (!activityReports) {
        return;
    }


    if (!supabaseClient) {

        console.error(
            "Supabaseが利用できません。"
        );

        return;

    }


    try {

        let result = await supabaseClient
            .from("activity_reports")
            .select("id, created_at, title, thumbnail, body, category, tags, is_pinned")
            .order("created_at", { ascending: false });

        if (isActivityPinnedColumnError(result.error)) {
            result = await supabaseClient
                .from("activity_reports")
                .select("id, created_at, title, thumbnail, body, category, tags")
                .order("created_at", { ascending: false });
        }

        // Keep older installations readable until the category migration is applied.
        if (isActivityMetadataColumnError(result.error)) {
            result = await supabaseClient
                .from("activity_reports")
                .select("id, created_at, title, thumbnail, body")
                .order("created_at", { ascending: false });
        }


        const data =
            result.data;


        const error =
            result.error;


        if (error) {

            console.error(
                "活動報告の取得に失敗しました:",
                error
            );

            showActivityError();

            return;

        }


        if (
            !data ||
            data.length === 0
        ) {
            allActivityReports = [];
            activityReports.innerHTML = `
                <div class="activity-report-empty">
                    <span aria-hidden="true">66</span>
                    <p>団全体の活動報告を、こちらに掲載していきます。</p>
                    <p>現在、掲載内容を準備しています。</p>
                </div>`;
            return;
        }

        allActivityReports = data.sort((a, b) =>
            Number(Boolean(b.is_pinned)) - Number(Boolean(a.is_pinned)) ||
            new Date(b.created_at) - new Date(a.created_at)
        );
        data.forEach((report) => {
            (Array.isArray(report.tags) ? report.tags : []).forEach(addActivityTagFilter);
        });
        renderFilteredActivityReports();

    } catch (error) {

        console.error(
            "活動報告処理中にエラーが発生しました:",
            error
        );

        showActivityError();

    }

}



function createActivityArticle(report) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "activity-report-card";


    if (report.thumbnail) {

        const thumbnail =
            document.createElement(
                "div"
            );


        thumbnail.className =
            "activity-report-thumbnail";


        const image =
            document.createElement(
                "img"
            );


        image.src =
            report.thumbnail;


        image.alt =
            report.title ||
            "活動報告";


        thumbnail.appendChild(
            image
        );


        article.appendChild(
            thumbnail
        );

    }


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "activity-report-content";

    if (report.is_pinned) {
        const pinBadge = document.createElement("span");
        pinBadge.className = "activity-report-pin-badge";
        pinBadge.textContent = "ピン止め";
        content.appendChild(pinBadge);
    }


    const date =
        document.createElement(
            "p"
        );


    date.className =
        "activity-report-date";


    const createdDate =
        new Date(
            report.created_at
        );


    date.textContent =
        createdDate.toLocaleDateString(
            "ja-JP",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    content.appendChild(
        date
    );

    const labels = [report.category, ...(Array.isArray(report.tags) ? report.tags : [])]
        .filter(Boolean);
    if (labels.length) {
        const labelList = document.createElement("ul");
        labelList.className = "activity-report-labels";
        labels.forEach((label) => {
            const item = document.createElement("li");
            item.textContent = label;
            labelList.appendChild(item);
        });
        content.appendChild(labelList);
    }


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        report.title ||
        "無題";


    content.appendChild(
        title
    );


    const body =
        document.createElement(
            "div"
        );


    body.className =
        "activity-report-body";


    body.textContent =
        report.body ||
        "";


    content.appendChild(
        body
    );


    article.appendChild(
        content
    );


    return article;

}



function showActivityError() {

    if (!activityReports) {
        return;
    }


    activityReports.innerHTML = `
        <div class="activity-report-empty">

            <span aria-hidden="true">
                !
            </span>

            <p>
                活動報告を読み込めませんでした。
            </p>

            <p>
                Consoleを確認してください。
            </p>

        </div>
    `;

}



if (
    editActivityButton &&
    activityAdminOverlay
) {

    editActivityButton.addEventListener(
        "click",
        async function () {

            activityAdminOverlay.classList.add(
                "open"
            );


            if (activityPasswordArea) {

                activityPasswordArea.style.display =
                    "block";

            }


            if (activityEditorArea) {

                activityEditorArea.style.display =
                    "none";

            }


            if (activityPasswordError) {

                activityPasswordError.textContent =
                    "";

            }


            if (activityPassword) activityPassword.value = "";
            if (activityEmail) activityEmail.value = "";
            try {
                if (await isSiteAdmin()) {
                    activityPasswordArea.style.display = "none";
                    activityEditorArea.style.display = "block";
                    await loadAdminActivityReports();
                } else if (activityEmail) {
                    activityEmail.focus();
                }
            } catch (error) {
                activityPasswordError.textContent = `管理者確認に失敗しました: ${error.message}`;
            }

        }
    );

}



if (activityAdminClose) {

    activityAdminClose.addEventListener(
        "click",
        function () {

            closeActivityAdmin();

        }
    );

}



if (activityAdminOverlay) {

    activityAdminOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                activityAdminOverlay
            ) {

                closeActivityAdmin();

            }

        }
    );

}



function closeActivityAdmin() {

    if (!activityAdminOverlay) {
        return;
    }


    activityAdminOverlay.classList.remove(
        "open"
    );


    resetActivityEditor();

}



if (activityPasswordButton) {

    activityPasswordButton.addEventListener(
        "click",
        async function () {
            try {
                await signInSiteAdmin(activityEmail.value.trim(), activityPassword.value);
                activityPasswordError.textContent = "";
                activityPasswordArea.style.display = "none";
                activityEditorArea.style.display = "block";
                activityPassword.value = "";
                activityEmail.value = "";
                await loadAdminActivityReports();
            } catch (error) {
                activityPasswordError.textContent = error.message || "ログインできませんでした。";
                activityPassword.value = "";
                activityEmail.focus();
            }

        }
    );

}



if (activityPassword) {

    activityPassword.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                if (activityPasswordButton) {

                    activityPasswordButton.click();

                }

            }

        }
    );

}



async function loadAdminActivityReports() {

    if (!activityAdminReports) {
        return;
    }


    activityAdminReports.innerHTML =
        "<p>読み込み中……</p>";


    if (!supabaseClient) {

        activityAdminReports.innerHTML =
            "<p>Supabaseが利用できません。</p>";

        return;

    }


    try {

        let result = await supabaseClient
            .from("activity_reports")
            .select("id, created_at, title, thumbnail, body, category, tags, is_pinned")
            .order("created_at", { ascending: false });

        if (isActivityPinnedColumnError(result.error)) {
            result = await supabaseClient
                .from("activity_reports")
                .select("id, created_at, title, thumbnail, body, category, tags")
                .order("created_at", { ascending: false });
        }

        if (isActivityMetadataColumnError(result.error)) {
            result = await supabaseClient
                .from("activity_reports")
                .select("id, created_at, title, thumbnail, body")
                .order("created_at", { ascending: false });
        }


        const data =
            result.data;


        const error =
            result.error;


        if (error) {

            console.error(
                "管理画面の記事取得エラー:",
                error
            );


            activityAdminReports.innerHTML =
                `<p>記事を取得できませんでした: ${error.message}</p>`;

            return;

        }


        activityAdminReports.innerHTML =
            "";


        if (
            !data ||
            data.length === 0
        ) {

            activityAdminReports.innerHTML =
                "<p>現在、記事はありません。</p>";

            return;

        }


        data.forEach(
            function (report) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "activity-admin-report-item";


                const title =
                    document.createElement(
                        "p"
                    );


                title.className =
                    "activity-admin-report-title";


                title.textContent =
                    report.title ||
                    "無題";

                item.appendChild(
                    title
                );

                const labels = [report.category, ...(Array.isArray(report.tags) ? report.tags : [])]
                    .filter(Boolean);
                if (labels.length) {
                    const metadata = document.createElement("small");
                    metadata.className = "activity-admin-report-labels";
                    metadata.textContent = labels.join(" / ");
                    item.appendChild(metadata);
                }

                const actions = document.createElement("div");
                actions.className = "activity-report-admin-actions";

                const pinButton = document.createElement("button");
                pinButton.type = "button";
                pinButton.className = "activity-report-pin-button";
                pinButton.textContent = report.is_pinned ? "ピン解除" : "ピン止め";
                pinButton.setAttribute("aria-pressed", String(Boolean(report.is_pinned)));
                pinButton.addEventListener("click", () => toggleActivityReportPin(report, pinButton));
                actions.appendChild(pinButton);


                const editButton =
                    document.createElement(
                        "button"
                    );


                editButton.type =
                    "button";


                editButton.textContent =
                    "編集";


                editButton.className =
                    "activity-report-edit-button";


                editButton.addEventListener(
                    "click",
                    function () {

                        startActivityEdit(
                            report
                        );

                    }
                );


                actions.appendChild(
                    editButton
                );


                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.type =
                    "button";


                deleteButton.textContent =
                    "削除";


                deleteButton.className =
                    "activity-report-delete-button";


                deleteButton.addEventListener(
                    "click",
                    function () {

                        deleteActivityReport(
                            report.id
                        );

                    }
                );


                actions.appendChild(
                    deleteButton
                );

                item.appendChild(actions);


                activityAdminReports.appendChild(
                    item
                );

            }
        );
    } catch (error) {

        console.error(
            "管理画面処理エラー:",
            error
        );


        activityAdminReports.innerHTML =
            `<p>記事の読み込みに失敗しました: ${error.message || error}</p>`;

    }

}

async function toggleActivityReportPin(report, button) {
    if (!supabaseClient || !report || !button) return;
    button.disabled = true;

    try {
        const nextPinnedState = !Boolean(report.is_pinned);
        const { data, error } = await supabaseClient
            .from("activity_reports")
            .update({ is_pinned: nextPinnedState })
            .eq("id", report.id)
            .select("id")
            .maybeSingle();

        if (error) {
            activityPublishMessage.textContent = isActivityPinnedColumnError(error)
                ? "ピン止め用の列がありません。supabase/activity_report_pinned.sql をSupabase SQL Editorで実行してください。"
                : `ピン止めを変更できませんでした: ${error.message}`;
            button.disabled = false;
            return;
        }

        if (!data) {
            activityPublishMessage.textContent = "ピン止めを変更できませんでした。Supabaseのactivity_reports更新ポリシーを確認してください。";
            button.disabled = false;
            return;
        }

        activityPublishMessage.textContent = nextPinnedState
            ? "活動報告をピン止めしました。"
            : "活動報告のピン止めを解除しました。";
        await loadActivityReports();
        await loadAdminActivityReports();
    } catch (error) {
        activityPublishMessage.textContent = `ピン止めを変更できませんでした: ${error.message || error}`;
        button.disabled = false;
    }
}



function startActivityEdit(report) {

    activityEditorArea.dataset.editingId =
        report.id;


    activityEditorArea.dataset.editingThumbnail =
        report.thumbnail ||
        "";


    activityTitle.value =
        report.title ||
        "";


    activityBody.value =
        report.body ||
        "";

    if (activityCategory) {
        activityCategory.value = report.category || "演舞演奏会";
        updateActivityTagVisibility();
    }
    setActivityTags(Array.isArray(report.tags) ? report.tags : []);


    activityThumbnailFile.value =
        "";


    activityThumbnailStatus.textContent =
        report.thumbnail
            ? "現在の画像を使用します。新しい画像を選ぶと変更されます。"
            : "画像はありません。";


    activityPublishButton.textContent =
        "変更を保存";


    activityCancelEditButton.style.display =
        "block";


    activityPublishMessage.textContent =
        "この記事を編集しています。";


    activityTitle.focus();

}



if (activityCancelEditButton) {

    activityCancelEditButton.addEventListener(
        "click",
        function () {

            resetActivityEditor();

        }
    );

}



function resetActivityEditor() {

    if (!activityEditorArea) {
        return;
    }


    activityEditorArea.dataset.editingId =
        "";


    activityEditorArea.dataset.editingThumbnail =
        "";


    if (activityTitle) {
        activityTitle.value = "";
    }


    if (activityBody) {
        activityBody.value = "";
    }

    if (activityCategory) {
        activityCategory.value = "演舞演奏会";
        updateActivityTagVisibility();
    }
    setActivityTags([]);


    if (activityThumbnailFile) {
        activityThumbnailFile.value = "";
    }


    if (activityThumbnailStatus) {
        activityThumbnailStatus.textContent = "";
    }


    if (activityPublishButton) {

        activityPublishButton.textContent =
            "公開する";

    }


    if (activityCancelEditButton) {

        activityCancelEditButton.style.display =
            "none";

    }


    if (activityPublishMessage) {

        activityPublishMessage.textContent =
            "";

    }

}



if (activityThumbnailFile) {

    activityThumbnailFile.addEventListener(
        "change",
        function () {

            const file =
                activityThumbnailFile.files[0];


            if (!file) {

                activityThumbnailStatus.textContent =
                    "";

                return;

            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                activityThumbnailStatus.textContent =
                    "画像ファイルを選択してください。";

                activityThumbnailFile.value =
                    "";

                return;

            }


            if (
                file.size >
                10 * 1024 * 1024
            ) {

                activityThumbnailStatus.textContent =
                    "画像は10MB以下にしてください。";

                activityThumbnailFile.value =
                    "";

                return;

            }


            activityThumbnailStatus.textContent =
                "選択中: " +
                file.name;

        }
    );

}



if (activityPublishButton) {

    activityPublishButton.addEventListener(
        "click",
        async function () {

            const title =
                activityTitle.value.trim();


            const body =
                activityBody.value.trim();

            const category = activityCategory ? activityCategory.value : "演舞演奏会";
            const tags = selectedActivityTags();


            const imageFile =
                activityThumbnailFile.files[0];


            const editingId =
                activityEditorArea.dataset.editingId ||
                "";


            const originalThumbnail =
                activityEditorArea.dataset.editingThumbnail ||
                "";


            if (!title) {

                activityPublishMessage.textContent =
                    "題名を入力してください。";

                activityTitle.focus();

                return;

            }


            if (!body) {

                activityPublishMessage.textContent =
                    "本文を入力してください。";

                activityBody.focus();

                return;

            }


            activityPublishButton.disabled =
                true;


            activityPublishMessage.textContent =
                editingId
                    ? "変更を保存しています……"
                    : "公開しています……";


            try {

                let thumbnailUrl =
                    null;



                if (imageFile) {

                    if (
                        !imageFile.type.startsWith(
                            "image/"
                        )
                    ) {

                        activityPublishMessage.textContent =
                            "画像ファイルを選択してください。";

                        return;

                    }


                    if (
                        imageFile.size >
                        10 * 1024 * 1024
                    ) {

                        activityPublishMessage.textContent =
                            "画像は10MB以下にしてください。";

                        return;

                    }


                    const extension =
                        imageFile.name
                            .split(".")
                            .pop()
                            .toLowerCase();


                    const fileName =
                        Date.now() +
                        "-" +
                        crypto.randomUUID() +
                        "." +
                        extension;


                    activityPublishMessage.textContent =
                        "画像をアップロードしています……";


                    const uploadResult =
                        await supabaseClient
                            .storage
                            .from(
                                "activity-images"
                            )
                            .upload(
                                fileName,
                                imageFile,
                                {
                                    cacheControl:
                                        "3600",

                                    upsert:
                                        false
                                }
                            );


                    if (
                        uploadResult.error
                    ) {

                        console.error(
                            "画像アップロードエラー:",
                            uploadResult.error
                        );


                        activityPublishMessage.textContent =
                            "画像のアップロードに失敗しました。";

                        return;

                    }


                    const publicUrlResult =
                        supabaseClient
                            .storage
                            .from(
                                "activity-images"
                            )
                            .getPublicUrl(
                                fileName
                            );


                    thumbnailUrl =
                        publicUrlResult
                            .data
                            .publicUrl;

                }



                if (editingId) {

                    const finalThumbnail =
                        thumbnailUrl ||
                        originalThumbnail ||
                        null;


                    const result =
                        await supabaseClient
                            .from(
                                "activity_reports"
                            )
                            .update(
                                {
                                    title:
                                        title,

                                    category,

                                    tags,

                                    thumbnail:
                                        finalThumbnail,

                                    body:
                                        body
                                }
                            )
                            .eq(
                                "id",
                                editingId
                            )
                            .select("id")
                            .maybeSingle();


                    if (result.error) {

                        console.error(
                            "記事編集エラー:",
                            result.error
                        );


                        activityPublishMessage.textContent =
                            isActivityMetadataColumnError(result.error)
                                ? "分類・ラベル用の列がまだありません。supabase/activity_report_categories.sql をSupabase SQL Editorで実行してください。"
                                : `変更を保存できませんでした: ${result.error.message}`;

                        return;

                    }


                    if (!result.data) {

                        activityPublishMessage.textContent =
                            "保存対象の記事が見つからないか、Supabaseで編集権限が許可されていません。activity_reportsの更新ポリシーを確認してください。";

                        return;

                    }


                    activityPublishMessage.textContent =
                        "変更を保存しました！";


                } else {


                    const result =
                        await supabaseClient
                            .from(
                                "activity_reports"
                            )
                            .insert(
                                [
                                    {
                                        title:
                                            title,

                                        category,

                                        tags,

                                        thumbnail:
                                            thumbnailUrl,

                                        body:
                                            body
                                    }
                                ]
                            );


                    if (result.error) {

                        console.error(
                            "記事追加エラー:",
                            result.error
                        );


                        activityPublishMessage.textContent =
                            isActivityMetadataColumnError(result.error)
                                ? "分類・ラベル用の列がまだありません。supabase/activity_report_categories.sql をSupabase SQL Editorで実行してください。"
                                : `記事の公開に失敗しました: ${result.error.message}`;

                        return;

                    }


                    activityPublishMessage.textContent =
                        "公開しました！";

                }


                resetActivityEditor();


                await loadActivityReports();


                await loadAdminActivityReports();


            } catch (error) {

                console.error(
                    "活動報告保存エラー:",
                    error
                );


                activityPublishMessage.textContent =
                    "エラーが発生しました。Consoleを確認してください。";

            } finally {

                activityPublishButton.disabled =
                    false;

            }

        }
    );

}



async function deleteActivityReport(id) {

    const confirmed =
        window.confirm(
            "この活動報告を削除しますか？"
        );


    if (!confirmed) {
        return;
    }


    try {

        if (!supabaseClient) {

            alert(
                "Supabaseが利用できません。"
            );

            return;

        }


        const result =
            await supabaseClient
                .from(
                    "activity_reports"
                )
                .delete()
                .eq(
                    "id",
                    id
                );


        if (result.error) {

            console.error(
                "記事削除エラー:",
                result.error
            );


            alert(
                "削除に失敗しました。Consoleを確認してください。"
            );

            return;

        }


        alert(
            "削除しました。"
        );


        await loadActivityReports();


        await loadAdminActivityReports();


    } catch (error) {

        console.error(
            "削除処理エラー:",
            error
        );


        alert(
            "エラーが発生しました。"
        );

    }

}



if (activityReports) {

    loadActivityReports();

}

if (activityEmail) {
    activityEmail.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            activityPassword.focus();
        }
    });
}

const activityAdminLogout = document.getElementById("activityAdminLogout");
if (activityAdminLogout) {
    activityAdminLogout.addEventListener("click", async () => {
        try {
            await signOutSiteAdmin();
            activityEditorArea.style.display = "none";
            activityPasswordArea.style.display = "block";
            activityPasswordError.textContent = "ログアウトしました。";
            if (activityEmail) activityEmail.focus();
        } catch (error) {
            activityPasswordError.textContent = `ログアウトできませんでした: ${error.message}`;
        }
    });
}


const aboutSubmenuToggle =
    document.querySelector(".menu-submenu-toggle");

if (aboutSubmenuToggle) {

    const aboutSubmenu =
        document.getElementById("aboutSubmenu");

    if (aboutSubmenu) {

        aboutSubmenuToggle.addEventListener(
            "click",
            function () {

                const isExpanded =
                    aboutSubmenuToggle.getAttribute("aria-expanded") === "true";

                aboutSubmenuToggle.setAttribute(
                    "aria-expanded",
                    String(!isExpanded)
                );

                aboutSubmenu.hidden = isExpanded;

                const indicator =
                    aboutSubmenuToggle.querySelector("span");

                if (indicator) {
                    indicator.textContent = isExpanded ? "＋" : "－";
                }

            }
        );

    }

}


const welcomePosts = document.getElementById("welcomePosts");
if (welcomePosts) {
    const overlay = document.getElementById("welcomeAdminOverlay");
    const openButton = document.getElementById("welcomeAdminOpen");
    const closeButton = document.getElementById("welcomeAdminClose");
    const passwordArea = document.getElementById("welcomePasswordArea");
    const passwordInput = document.getElementById("welcomePassword");
    const emailInput = document.getElementById("welcomeEmail");
    const passwordButton = document.getElementById("welcomePasswordButton");
    const passwordError = document.getElementById("welcomePasswordError");
    const editorArea = document.getElementById("welcomeEditorArea");
    const form = document.getElementById("welcomePostForm");
    const titleInput = document.getElementById("welcomeTitle");
    const dateInput = document.getElementById("welcomeDate");
    const locationInput = document.getElementById("welcomeLocation");
    const mapEmbedUrlInput = document.getElementById("welcomeMapEmbedUrl");
    const calendarGrid = document.getElementById("welcomeCalendarGrid");
    const calendarMonthLabel = document.getElementById("welcomeCalendarMonth");
    const calendarStatus = document.getElementById("welcomeCalendarStatus");
    const calendarPrevButton = document.getElementById("welcomeCalendarPrev");
    const calendarNextButton = document.getElementById("welcomeCalendarNext");
    const calendarAdminOpenButton = document.getElementById("welcomeCalendarAdminOpen");
    const bodyInput = document.getElementById("welcomeBody");
    const urlInput = document.getElementById("welcomeUrl");
    const saveButton = document.getElementById("welcomeSaveButton");
    const cancelEditButton = document.getElementById("welcomeCancelEdit");
    const saveMessage = document.getElementById("welcomeSaveMessage");
    const adminPosts = document.getElementById("welcomeAdminPosts");
    const logoutButton = document.getElementById("welcomeAdminLogout");
    let cachedPosts = [];
    const displayedCalendarMonth = new Date();
    displayedCalendarMonth.setDate(1);

    function formatDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function renderWelcomeCalendar(posts) {
        if (!calendarGrid || !calendarMonthLabel) return;

        const year = displayedCalendarMonth.getFullYear();
        const month = displayedCalendarMonth.getMonth();
        calendarMonthLabel.textContent = displayedCalendarMonth.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long"
        });
        calendarGrid.replaceChildren();

        const firstWeekday = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
        const todayKey = formatDateKey(new Date());
        let visibleEventCount = 0;

        for (let index = 0; index < cellCount; index += 1) {
            const date = new Date(year, month, index - firstWeekday + 1);
            const dateKey = formatDateKey(date);
            const dayPosts = posts.filter((post) => post.event_date === dateKey);
            if (date.getMonth() === month) visibleEventCount += dayPosts.length;

            const cell = document.createElement(dayPosts.length ? "button" : "div");
            if (dayPosts.length) cell.type = "button";
            cell.className = "welcome-calendar-day";
            if (date.getMonth() !== month) cell.classList.add("is-outside-month");
            if (dateKey === todayKey) cell.classList.add("is-today");

            const dayNumber = document.createElement("span");
            dayNumber.className = "welcome-calendar-day-number";
            dayNumber.textContent = String(date.getDate());
            cell.appendChild(dayNumber);

            dayPosts.slice(0, 2).forEach((post) => {
                const eventLabel = document.createElement("span");
                eventLabel.className = "welcome-calendar-event";
                eventLabel.textContent = post.title || "新歓企画";
                cell.appendChild(eventLabel);
            });
            if (dayPosts.length > 2) {
                const more = document.createElement("span");
                more.className = "welcome-calendar-more";
                more.textContent = `ほか${dayPosts.length - 2}件`;
                cell.appendChild(more);
            }

            if (dayPosts.length) {
                cell.setAttribute(
                    "aria-label",
                    `${date.toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}：${dayPosts.map((post) => post.title).join("、")}`
                );
                cell.addEventListener("click", () => {
                    const target = document.getElementById(`welcome-post-${dayPosts[0].id}`);
                    target?.scrollIntoView({ behavior: "smooth", block: "center" });
                });
            } else {
                cell.setAttribute("aria-hidden", "true");
            }
            calendarGrid.appendChild(cell);
        }

        if (calendarStatus) {
            calendarStatus.textContent = visibleEventCount
                ? `この月の企画は${visibleEventCount}件です。日付を押すと企画内容を確認できます。`
                : "この月に日程が決まっている企画はありません。前後の月もご確認ください。";
        }
    }

    calendarPrevButton?.addEventListener("click", () => {
        displayedCalendarMonth.setMonth(displayedCalendarMonth.getMonth() - 1);
        renderWelcomeCalendar(cachedPosts);
    });
    calendarNextButton?.addEventListener("click", () => {
        displayedCalendarMonth.setMonth(displayedCalendarMonth.getMonth() + 1);
        renderWelcomeCalendar(cachedPosts);
    });
    calendarAdminOpenButton?.addEventListener("click", () => openButton.click());

    function getGoogleMapsEmbedUrl(value) {
        if (!value) return null;
        try {
            const url = new URL(value);
            const allowedHosts = ["www.google.com", "maps.google.com"];
            if (
                url.protocol === "https:" &&
                allowedHosts.includes(url.hostname) &&
                url.pathname === "/maps/embed"
            ) {
                return url.href;
            }
        } catch (_) {
        }
        return null;
    }

    function formatWelcomeDate(value) {
        if (!value) return "日程調整中";
        const date = new Date(`${value}T00:00:00`);
        return Number.isNaN(date.getTime())
            ? "日程調整中"
            : date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
    }

    function appendWelcomePost(container, post) {
        const article = document.createElement("article");
        article.className = "welcome-post-card";
        article.id = `welcome-post-${post.id}`;

        const date = document.createElement("p");
        date.className = "welcome-post-date";
        date.textContent = formatWelcomeDate(post.event_date);
        article.appendChild(date);

        const title = document.createElement("h3");
        title.textContent = post.title || "企画のお知らせ";
        article.appendChild(title);

        if (post.location) {
            const location = document.createElement("p");
            location.className = "welcome-post-location";
            location.textContent = post.location;
            article.appendChild(location);
        }

        const mapEmbedUrl = getGoogleMapsEmbedUrl(post.map_embed_url);
        if (mapEmbedUrl) {
            const map = document.createElement("figure");
            map.className = "welcome-post-map";
            const caption = document.createElement("figcaption");
            caption.textContent = "会場の地図";
            const frame = document.createElement("iframe");
            frame.src = mapEmbedUrl;
            frame.title = `${post.title || "企画"}の会場地図`;
            frame.loading = "lazy";
            frame.referrerPolicy = "strict-origin-when-cross-origin";
            frame.allowFullscreen = true;
            map.append(caption, frame);
            article.appendChild(map);
        }

        const body = document.createElement("p");
        body.className = "welcome-post-body";
        body.textContent = post.body || "";
        article.appendChild(body);

        if (post.details_url) {
            try {
                const url = new URL(post.details_url);
                if (url.protocol === "https:" || url.protocol === "http:") {
                    const link = document.createElement("a");
                    link.href = url.href;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.className = "welcome-post-link";
                    link.textContent = "企画の詳細を見る ↗";
                    article.appendChild(link);
                }
            } catch (_) {
            }
        }

        container.appendChild(article);
    }

    async function loadWelcomePosts() {
        if (!supabaseClient) {
            welcomePosts.innerHTML = '<p class="welcome-empty">お知らせを読み込めませんでした。</p>';
            if (calendarStatus) calendarStatus.textContent = "企画日程を読み込めませんでした。";
            return;
        }

        welcomePosts.innerHTML = '<p class="welcome-empty">企画情報を読み込んでいます。</p>';
        const { data, error } = await supabaseClient
            .from("welcome_posts")
            .select("id, title, event_date, location, body, details_url, map_embed_url, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("新歓企画の取得に失敗しました:", error);
            welcomePosts.innerHTML = '<p class="welcome-empty">企画情報を読み込めませんでした。Supabaseのwelcome_posts設定をご確認ください。</p>';
            if (calendarStatus) calendarStatus.textContent = "企画日程を読み込めませんでした。Supabaseの設定をご確認ください。";
            if (adminPosts) adminPosts.textContent = `読み込みエラー: ${error.message}`;
            return;
        }

        cachedPosts = data || [];
        renderWelcomeCalendar(cachedPosts);
        welcomePosts.replaceChildren();
        if (cachedPosts.length === 0) {
            welcomePosts.innerHTML = '<p class="welcome-empty">新歓や見学・体験の企画情報を、こちらでお知らせします。</p>';
        } else {
            cachedPosts.forEach((post) => appendWelcomePost(welcomePosts, post));
        }
        renderWelcomeAdminPosts();
    }

    function renderWelcomeAdminPosts() {
        if (!adminPosts) return;
        adminPosts.replaceChildren();
        if (cachedPosts.length === 0) {
            adminPosts.innerHTML = "<p>投稿済みの企画はありません。</p>";
            return;
        }

        cachedPosts.forEach((post) => {
            const row = document.createElement("div");
            row.className = "welcome-admin-post";
            const title = document.createElement("span");
            title.textContent = post.title;
            row.appendChild(title);

            const actions = document.createElement("div");
            actions.className = "welcome-admin-actions";
            const edit = document.createElement("button");
            edit.type = "button";
            edit.textContent = "編集";
            edit.addEventListener("click", () => {
                form.dataset.editingId = post.id;
                titleInput.value = post.title || "";
                dateInput.value = post.event_date || "";
                locationInput.value = post.location || "";
                mapEmbedUrlInput.value = post.map_embed_url || "";
                bodyInput.value = post.body || "";
                urlInput.value = post.details_url || "";
                saveButton.textContent = "変更を保存";
                cancelEditButton.hidden = false;
                saveMessage.textContent = "この記事を編集中です。";
                titleInput.focus();
            });
            actions.appendChild(edit);

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "welcome-delete-button";
            remove.textContent = "削除";
            remove.addEventListener("click", async () => {
                if (!window.confirm(`「${post.title}」を削除しますか？`)) return;
                const { error } = await supabaseClient.from("welcome_posts").delete().eq("id", post.id);
                if (error) {
                    saveMessage.textContent = `削除できませんでした: ${error.message}`;
                    return;
                }
                saveMessage.textContent = "企画を削除しました。";
                await loadWelcomePosts();
            });
            actions.appendChild(remove);
            row.appendChild(actions);
            adminPosts.appendChild(row);
        });
    }

    function resetWelcomeForm() {
        form.reset();
        form.dataset.editingId = "";
        mapEmbedUrlInput.value = "";
        saveButton.textContent = "投稿する";
        cancelEditButton.hidden = true;
        saveMessage.textContent = "";
    }

    openButton.addEventListener("click", async () => {
        overlay.classList.add("open");
        overlay.setAttribute("aria-hidden", "false");
        passwordArea.hidden = false;
        editorArea.hidden = true;
        passwordInput.value = "";
        emailInput.value = "";
        passwordError.textContent = "";
        try {
            if (await isSiteAdmin()) {
                passwordArea.hidden = true;
                editorArea.hidden = false;
                await loadWelcomePosts();
            } else {
                emailInput.focus();
            }
        } catch (error) {
            passwordError.textContent = `管理者確認に失敗しました: ${error.message}`;
        }
    });

    closeButton.addEventListener("click", () => {
        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
        passwordInput.value = "";
        emailInput.value = "";
        resetWelcomeForm();
    });

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeButton.click();
    });

    passwordButton.addEventListener("click", async () => {
        try {
            await signInSiteAdmin(emailInput.value.trim(), passwordInput.value);
            passwordError.textContent = "";
            passwordArea.hidden = true;
            editorArea.hidden = false;
            passwordInput.value = "";
            emailInput.value = "";
            renderWelcomeAdminPosts();
        } catch (error) {
            passwordError.textContent = error.message || "ログインできませんでした。";
            passwordInput.value = "";
            emailInput.focus();
        }
    });

    emailInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            passwordInput.focus();
        }
    });

    logoutButton.addEventListener("click", async () => {
        try {
            await signOutSiteAdmin();
            editorArea.hidden = true;
            passwordArea.hidden = false;
            passwordError.textContent = "ログアウトしました。";
            emailInput.focus();
        } catch (error) {
            saveMessage.textContent = `ログアウトできませんでした: ${error.message}`;
        }
    });

    passwordInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            passwordButton.click();
        }
    });

    cancelEditButton.addEventListener("click", resetWelcomeForm);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!supabaseClient) {
            saveMessage.textContent = "Supabaseに接続できません。";
            return;
        }

        const editingId = form.dataset.editingId || "";
        const mapEmbedInputValue = mapEmbedUrlInput.value.trim();
        const mapEmbedUrl = getGoogleMapsEmbedUrl(mapEmbedInputValue);
        if (mapEmbedInputValue && !mapEmbedUrl) {
            saveMessage.textContent = "Googleマップの「地図を埋め込む」で表示されるURLを入力してください。";
            mapEmbedUrlInput.focus();
            return;
        }
        const post = {
            title: titleInput.value.trim(),
            event_date: dateInput.value || null,
            location: locationInput.value.trim() || null,
            body: bodyInput.value.trim(),
            details_url: urlInput.value.trim() || null,
            map_embed_url: mapEmbedUrl
        };
        saveButton.disabled = true;
        saveMessage.textContent = editingId ? "変更を保存しています……" : "企画を投稿しています……";

        try {
            const result = editingId
                ? await supabaseClient.from("welcome_posts").update(post).eq("id", editingId).select("id").maybeSingle()
                : await supabaseClient.from("welcome_posts").insert(post).select("id").single();

            if (result.error) {
                saveMessage.textContent = `保存できませんでした: ${result.error.message}`;
                return;
            }
            if (editingId && !result.data) {
                saveMessage.textContent = "更新権限がありません。Supabaseのwelcome_posts更新ポリシーをご確認ください。";
                return;
            }

            resetWelcomeForm();
            saveMessage.textContent = editingId ? "変更を保存しました。" : "企画を投稿しました。";
            await loadWelcomePosts();
        } catch (error) {
            console.error("新歓企画の保存に失敗しました:", error);
            saveMessage.textContent = `保存に失敗しました: ${error.message || error}`;
        } finally {
            saveButton.disabled = false;
        }
    });

    loadWelcomePosts().catch((error) => {
        console.error("新歓企画の読み込みに失敗しました:", error);
        welcomePosts.innerHTML = '<p class="welcome-empty">企画情報を読み込めませんでした。</p>';
    });
}
