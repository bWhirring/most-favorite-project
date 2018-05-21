window.addEventListener("load", function () {
  let hasWebExtensionWallet = typeof (webExtensionWallet) !== "undefined";
  const search = $(".btn-search");
  const topic = $(".btn-topic");
  const navigation = $('.navigation');
  var page = 1;
  var totalPage = 0;
  var sort = '';
  if (hasWebExtensionWallet) { //判断是否存在WebExtensionWallet
    search.on('click', function () {
      getData();
    })
    topic.on('click', function () {
      getTopicData();
    })
  } else {
    $('.title').html(
      '请先下载<a href="https://github.com/ChengOrangeJu/WebExtensionWallet" target="_blank">WebExtensionWallet</a>'
    )
    search.on('click', function () {
      alert('请先安装WebExtensionWallet插件');
    })
  }

  function getData() {
    var name = $("#project").val();
    if (!name) {
      alert('请输入要搜索的语言名称，比如Javascript');
      return false;
    }
    $.ajax({
      url: `https://api.github.com/search/topics?q=${name}+is:featured`,
      method: 'GET',
      headers: {
        Accept: "application/vnd.github.mercy-preview+json",
      },
      success: function (data) {
        renderTable(data.items);
      }
    })
  }

  function renderTable(items) {
    var html = "";
    var len = items.length;
    if (len > 0) {
      for (let i = 0; i < items.length; i++) {
        html += "<tr>\
                  <th scope='row'>" + (i + 1) + "</th>\
                  <td>" + items[i].name + "</td>\
                  <td>" + items[i].display_name + "</td>\
                  <td>" + items[i].short_description + "</td>\
                  <td>" + items[i].created_by + "</td>\
                  <td>" + items[i].score + "</td>\
                </tr>"

      }
      onButtonClick();
    } else {
      html += "<tr><td>暂无数据</td></tr>"
    }
    $(".favorite table tbody").html(html);
  }

  function getTopicData() {
    var topic = $("#topic").val();
    if (!topic) {
      alert('请输入要搜索的项目名称，比如react');
      return false;
    }
    $.ajax({
      url: `https://api.github.com/search/repositories?q=${topic}&sort=${sort}&order=desc&page=${page}&per_page=20`,
      method: 'GET',
      success: function (data) {
        console.log(data);
        totalPage = data.total_count;
        rendeTopic(data.items);
      }
    })
  }
  $(".sort").on('change', function () {
    var val = $(this).val();
    switch (val) {
      case 0:
        sort = '';
        break;
      case 1:
        sort = 'stars';
        break;
      case 2:
        sort = 'forks';
        break;
      default:
        sort = '';
        break;
    }
  })

  function rendeTopic(items) {
    var html = "";
    var len = items.length;
    var paginationHtml = "";
    totalPage = totalPage > 5 ? 5 : totalPage;
    if (len > 0) {
      $('.navigation').removeClass('hide');
      for (let j = 0; j < totalPage; j++) {
        paginationHtml += "<li class='page-item'>\
                            <a class='page-link'>" + (j + 1) + "</a>\
                          </li>"

      }
      $(".pagination").html(paginationHtml)
      $(".pagination").find('li').eq(0).addClass('active');
      for (let i = 0; i < items.length; i++) {
        html += "<tr>\
                <th scope='row'>" + (i + 1) + "</th>\
                <td>" + items[i].name + "</td>\
                <td>" + items[i].full_name + "</td>\
                <td>" + items[i].description + "</td>\
                <td><a href= " + items[i].html_url + " target='_blank'>" + items[i].html_url + "</a></td>\
                <td><a href=" + items[i].url + " target='_blank'>" + items[i].url + "</a></td>\
                <td>" + items[i].stargazers_count + "</td>\
                <td>" + items[i].language + "</td>\
              </tr>"
      }
      onButtonClick();

    } else {
      $('.navigation').removeClass('show');
      html += "<tr><td>暂无数据</td></tr>"
    }
    $(".topic table tbody").html(html);
  }
  $(".pagination").on('click', 'li', function () {
    page = $(this).index() + 1;
    $(this).addClass('active')
      .siblings('li').removeClass('active');
    getTopicData();
  })
})

function message() {
  window.postMessage({
    "target": "contentscript",
    "data": {
      //"from": from,
      "to": "n1M5ADSZx15bH13BKfPAEji1d6f6sfM2vZn",
      "value": "0",
      "contract": {}
    },
    "method": "neb_call"
  }, "*");
}

// // listen message from contentscript
// window.addEventListener('message', function (e) {
//   // e.detail contains the transferred data (can
//   console.log("recived by page:" + e + ", e.data:" + JSON.stringify(e.data));
// });
