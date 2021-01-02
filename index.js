const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const types = ["quote", "photo", "link", "conversation", "regular", "audio"]
const getDayName = (date) => days[new Date(date).getDay()];
const getMonthName = (date) => months[new Date(date).getMonth()]
const getDayOfMonth = (date) => {
    const day = new Date(date).getDate();
    if (day === 1) return `${day}st`
    else if (day === 2) return `${day}nd`
    else if (day === 3) return `${day}rd`
    else return `${day}th`
}

const addQuotePost = (post, index) => {

    $(".x-" + index + " .posts").append(`
        <div class="quote-post _card">
            <i class="bi bi-alarm-fill dash"></i>
            <span class="quote-text"> ${post["quote-text"]} </span>
            <div class="quote-source"> — ${post["quote-source"]} </div>
        </div>
    `)
}
const addPhotoPost = (post) => {
    $(".posts").append(`
        <div class="photo-post _card">
            <image class="photo-image" src=${post["photo-url-250"]} />
            <div class="photo-caption">${post["photo-caption"]}</div>
        </div>
    `)
}
const addLinkPost = (post, index) => {
    $(".x-" + index + " .posts").append(`
        <div class="link-post _card">
            <a class="link-text" href=${post["link-url"]}>${post["link-text"]}</a>
            <div class="link-description">${post["link-description"]}</div>
        </div>
    `)
}

const addAudioPost = (post, index) => {
    $(".x-" + index + " .posts").append(`
        <div class="audio-post _card">
            ${post["audio-player"]}
        </div>
    `)
}
const addConversationPost = (post, index) => {
    $(".x-" + index + " .posts").append(`
        <div class="conversation-post _card">
            <ul class="conversation-list"></ul> 
        </div>
    `)
    post.conversation.map(c => {
        $(".x-" + index + " .posts .conversation-list").append(`
            <li class="_list-item"> <span class="name">${c.name}:</span> <span>${c.phrase}</span></li>
        `)
    })
}
const addRegularPost = (post, index) => {
    
    $(".x-" + index + " .posts").append(`
        <div class="regular-post _card">
            ${post["regular-title"] ? `<h6 class="regular-title"> <a href=${post.url}>${post["regular-title"]}</a> </h6>` : ''}
            <div>${post["regular-body"]}</div>
        </div>
    `)
}
const postTypeAdder = (post, index) => {
    if (post.type === 'quote') addQuotePost(post, index)
    else if (post.type === 'photo') addPhotoPost(post, index)
    else if (post.type === 'link') addLinkPost(post, index)
    else if (post.type === 'conversation') addConversationPost(post, index)
    else if (post.type === 'audio') addAudioPost(post, index)
    else if (post.type === 'regular') addRegularPost(post, index)
}

$(document).ready(() => {
    $.getJSON("./data.json", (res) => {
        const { title, description } = res.tumblelog
        const { posts } = res;
        $(".app-title").text(title)
        $(".content-description").text(description)
        let groupByDate = [];
        posts.map(post => {
            const date = post["date-gmt"].slice(0, 10)
            const index = groupByDate.findIndex(post => post.date === date)
            if (index !== -1) {
                groupByDate[index].postGroup.push(post)
            }
            else {
                groupByDate.push({ date, postGroup: [].concat(post) })
            }
        })

        groupByDate.map((group, index) => {
            const day_name = getDayName(group.date)
            const month_name = getMonthName(group.date)
            const day_number = getDayOfMonth(group.date);
            $(".group-list").append(`
            <div class="wrapper x-${index}">
                <div class="post-date">
                    <span class="day">${day_name}</span>
                    <div class="day-parser">
                        <div class="month">${month_name}</div>
                        <div class="date">${day_number}</div>
                    </div>
                </div>
                <div class="posts"></div>
            </div>`)
            group.postGroup.map(item => postTypeAdder(item, index))
        })
    });

})