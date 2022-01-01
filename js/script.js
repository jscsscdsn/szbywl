var Myui = {
  'Score': function () {
    var hadpingfen = 0;
    $("ul.rating li").each(function (i) {
      var $title = $(this).attr("title");
      var $lis = $("ul.rating li");
      var num = $(this).index();
      var n = num + 1;
      $(this).click(function () {
        if (hadpingfen > 0) {
          layer.msg('已经评分,请务重复评分');
        } else {
          $lis.removeClass("active");
          $("ul.rating li:lt(" + n + ")").find(".fa").addClass("fa-star").removeClass("fa-star-o");
          $("#ratewords").html($title);
          var score = $(this).attr("val");
          var nocache = new Date().getTime();
          MyTheme.Ajax("/include/ajax.php?id=" + $('#rating').attr('data-id') + "&action=score&score=" + score + "&timestamp=" + nocache, 'get', 'text', '', function (r) {

            if (('' + r.responseText).indexOf("havescore") != -1) {
              layer.msg("您已经评过分啦");
              hadpingfen = 1;
            } else {
              hadpingfen = 1;
              layer.msg("感谢参与！");
            }
          });
        }
      }).hover(function () {
        this.myTitle = this.title;
        this.title = "";
        $(this).nextAll().find(".fa").addClass("fa-star-o").removeClass("fa-star");
        $(this).prevAll().find(".fa").addClass("fa-star").removeClass("fa-star-o");
        $(this).find(".fa").addClass("fa-star").removeClass("fa-star-o");
        $("#ratewords").html($title);
      }, function () {
        this.title = this.myTitle;
        $("ul.rating li:lt(" + n + ")").removeClass("hover");
      });
    });
  },
  'Autocomplete': function () {
    $('#wdxxxxxx').keyup(function () {
      var keywords = $(this).val();
      if (keywords == '') {
        $('#word').hide();
        return
      };
      $.ajax({
        url: '/ass.php?wd=' + keywords,
        dataType: 'jsonp',
        jsonp: 'cb', //回调函数的参数名(键值)key
        // jsonpCallback: 'fun', //回调函数名(值) value
        beforeSend: function () {
          $('.wordlist').append('<li>正在加载。。。</li>');
        },
        success: function (data) {
          $('#word').show();
          $('.wordlist').empty();
          if (data.s == '') {
            $('.wordlist').append('<li>未找到与 "' + keywords + '"相关的结果</li>');
          }
          $.each(data.s, function () {
            $('.wordlist').append('<li>' + this + '</li>');
          });
        },
        error: function () {
          $('#word').show();
          $('.wordlist').empty();
          $('#word').append('<li>查找"' + keywords + '"失败</li>');
        }
      });
    });
    //点击搜索数据复制给搜索框
    $(document).on('click', '.wordlist li', function () {
      var word = $(this).text();
      $('#wd').val(word);
      $('#word').hide();
      $('.submit').trigger('click');
      触发搜索事件
    })
    //失去焦点时隐藏	
    var clear = function () {
      $('#word').hide();
    }
    $("input").blur(function () {
      setTimeout(clear, 500);
    });
  },
  'Other': {
    'Topbg': function (high) {
      $(".myui-topbg").css({
        "height": high
      });
      $("#header-top").addClass("color");
      $(window).scroll(function () {
        if ($(window).scrollTop() > 10) {
          $("#header-top").removeClass("color");
        } else if ($(window).scrollTop() < 110) {
          $("#header-top").addClass("color");
        }
      });
    }
  }
};
var MyTheme = {
  'Browser': {
    url: document.URL,
    domain: document.domain,
    title: document.title,
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
    canvas: function () {
      return !!document.createElement("canvas").getContext
    }(),
    useragent: function () {
      var a = navigator.userAgent;
      return {
        mobile: !!a.match(/AppleWebKit.*Mobile.*/),
        ios: !!a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        android: -1 < a.indexOf("Android") || -1 < a.indexOf("Linux"),
        iPhone: -1 < a.indexOf("iPhone") || -1 < a.indexOf("Mac"),
        iPad: -1 < a.indexOf("iPad"),
        trident: -1 < a.indexOf("Trident"),
        presto: -1 < a.indexOf("Presto"),
        webKit: -1 < a.indexOf("AppleWebKit"),
        gecko: -1 < a.indexOf("Gecko") && -1 == a.indexOf("KHTML"),
        weixin: -1 < a.indexOf("MicroMessenger")
      }
    }()
  },
  'Cookie': {
    'Set': function (name, value, days) {
      var expires;
      if (days) {
        expires = days;
      } else {
        expires = "";
      }
      $.cookie(name, value, {
        expires: expires,
        path: '/'
      });
    },
    'Get': function (name) {
      var styles = $.cookie(name);
      return styles;
    },
    'Del': function (name, tips) {
      if (window.confirm(tips)) {
        $.cookie(name, null, {
          expires: -1,
          path: '/'
        });
        location.reload();
      } else {
        return false;
      }
    }
  },
  'Ajax': function (url, type, dataType, data, sfun, efun, cfun) {
    type = type || 'get';
    dataType = dataType || 'json';
    data = data || '';
    efun = efun || '';
    cfun = cfun || '';

    $.ajax({
      url: url,
      type: type,
      dataType: dataType,
      data: data,
      timeout: 5000,
      beforeSend: function (XHR) {},
      error: function (XHR, textStatus, errorThrown) {
        if (efun) efun(XHR, textStatus, errorThrown);
      },
      success: function (data) {
        sfun(data);
      },
      complete: function (XHR, TS) {
        if (cfun) cfun(XHR, TS);
      }
    })
  },
  'Mobile': {
    'Nav': {
      'Init': function () {
        if ($(".nav-slide").length) {
          $(".nav-slide").each(function () {
            var $that = $(this);
            MyTheme.Mobile.Nav.Set($that, $that.attr('data-align'));
          });
        }
      },
      'Set': function (id, align) {
        $index = id.find('.active').index() * 1;
        if ($index > 3) {
          $index = $index - 3;
        } else {
          $index = 0;
        }
        id.flickity({
          cellAlign: align,
          freeScroll: true,
          contain: true,
          prevNextButtons: false,
          pageDots: false,
          percentPosition: true,
          initialIndex: $index
        });
      }
    },
    'Mshare': function () {
      $(".open-share").click(function () {
        MyTheme.Browser.useragent.weixin ? $("body").append('<div class="mobile-share share-weixin"></div>') : $("body").append('<div class="mobile-share share-other"></div>');
        $(".mobile-share").click(function () {
          $(".mobile-share").remove();
          $("body").removeClass("modal-open");
        });
      });
    }
  },
  'Images': {
    'Lazyload': function () {
      $(".lazyload").lazyload({
        effect: "fadeIn",
        threshold: 200,
        failure_limit: 1,
        skip_invisible: false,
      });
    },
    'Qrcode': {
      'Init': function () {
        if ($("#qrcode").length) {
          var $that = $("#qrcode");
          MyTheme.Images.Qrcode.Set($that.attr('data-link'), $that.attr('data-dark'), $that.attr('data-light'));
          $that.attr("class", "img-responsive");
        }
      },
      'Set': function (url, dark, light) {
        url = 0 || location.href;
        var qrcode = new QRCode('qrcode', {
          text: url,
          width: 120,
          height: 120,
          colorDark: dark,
          colorLight: light,
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    },
    'Flickity': {
      'Init': function () {
        if ($(".flickity").length) {
          $(".flickity").each(function () {
            var $that = $(this);
            MyTheme.Images.Flickity.Set($that, $that.attr('data-align'), $that.attr('data-dots'), $that.attr('data-next'), $that.attr('data-play'));
            //MyTheme.Images.Lazyload();
          });
        }
      },
      'Set': function (id, align, dots, next, play) {
        dots = dots || false;
        next = next || false;
        play = play || false;
        id.flickity({
          cellAlign: align,
          wrapAround: true,
          contain: true,
          pageDots: dots,
          autoPlay: play,
          percentPosition: true,
          prevNextButtons: next
        });
      }
    }
  },
  'Link': {
    'Copy': {
      'Init': function () {
        $(".myui-copy-link").each(function () {
          var links = $(this).attr("data-url");
          MyTheme.Link.Copy.Set(this, links);
        });
        $(".myui-copy-html").each(function () {
          var html = $(this).parent().find(".content").html();
          MyTheme.Link.Copy.Set(this, html);
        });
      },
      'Set': function (id, content) {
        var clipboard = new Clipboard(id, {
          text: function () {
            return content;
          }
        });
        clipboard.on('success', function (e) {
          layer.msg('复制成功');
        });
        clipboard.on("error", function (e) {
          layer.msg('复制失败，请手动复制');
        });
      }

    },
    'Short': function () {
      $(".myui-short").each(function () {
        var codyId = this;
        var shortId = $(this);
        var shortUrl = shortId.val() || shortId.attr("data-url");
        var linkText = shortId.attr("data-text");
        if (myui.short == 1) {
          $.ajax({
            type: 'GET',
            url: myui.shortapi + shortUrl,
            dataType: 'jsonp',
            success: function (r) {
              url_short = r.data.url_short;
              if (shortId.val()) {
                shortId.val(linkText + url_short);
              } else if (shortId.attr("data-url")) {
                shortId.attr("data-url", url_short);
                MyTheme.Link.Copy.Set(codyId, linkText + url_short);
              }
            }
          });
        } else {
          if (shortId.val()) {
            shortId.val(linkText + shortUrl);
          } else if (shortId.attr("data-url")) {
            shortId.attr("data-url", shortUrl);
            MyTheme.Link.Copy.Set(codyId, linkText + shortUrl);
          }
        }
      });
    }
  },
  'Layer': {
    'Img': function (title, src, text) {
      layer.open({
        type: 1,
        title: title,
        skin: 'layui-layer-rim',
        content: '<div class="col-pd"><p><img src="' + src + '" width="240" /></p><p class="text-center">' + text + '</p></div>'
      });
    },
    'Html': function (title, html) {
      layer.open({
        type: 1,
        title: title,
        skin: 'layui-layer-rim',
        content: '<div class="col-pd">' + html + '</div>'
      });
    },
    'Popbody': function (name, title, html, day, wide, high) {
      var pop_is = MyTheme.Cookie.Get(name);
      var html = $(html).html();
      if (!pop_is) {
        layer.open({
          type: 1,
          title: title,
          skin: 'layui-layer-rim',
          content: html,
          area: [wide + 'px', high + 'px'],
          cancel: function () {
            MyTheme.Cookie.Set(name, 1, day);
          }
        });
      }
    }
  },
  'Other': {
    'Headroom': function () {
      if ($("#header-top").length) {
        var header = document.querySelector("#header-top");
        var headroom = new Headroom(header, {
          tolerance: 5,
          offset: 205,
          classes: {
            initial: "top-fixed",
            pinned: "top-fixed-up",
            unpinned: "top-fixed-down"
          }
        });
        headroom.init();
      }
      $(".dropdown-hover").click(function () {
        $(this).find(".dropdown-box").toggle();
      });
    },
    'Popup': function (id) {
      $(id).addClass("popup-visible");
      $("body").append('<div class="mask"></div>').addClass("hidden");
      $(".close-popup").click(function () {
        $(id).removeClass("popup-visible");
        $(".mask").remove();
        $("body").removeClass("hidden");
      });
      $(".mask").click(function () {
        $(id).removeClass("popup-visible");
        $(this).remove();
        $("body").removeClass("hidden");
      });
    },
    'Bootstrap': function () {
      $('a[data-toggle="tab"]').on("shown.bs.tab", function (a) {
        var b = $(a.target).text();
        $(a.relatedTarget).text();
        $("span.active-tab").html(b);
      });
    },
    'Skin': function () {
      var skinnum = 0,
        act;
      var lengths = $("link[name='skin']").length;
      $('.btnskin').click(function () {
        skinnum += 1;
        if (skinnum == lengths) {
          skinnum = 0;
        }
        var skin = $("link[name='skin']").eq(skinnum).attr("href");
        layer.msg("正在切换皮肤，请稍后...", {
          anim: 5,
          time: 2000
        }, function () {
          $("link[name='default']").attr({
            href: skin
          });
        });
        MyTheme.Cookie.Set('skinColor', skin, 365);
      });
      var color = MyTheme.Cookie.Get('skinColor');
      if (color) {
        $("link[name='default']").attr({
          href: color
        });
      }
    },
    'Sort': function () {
      $(".sort-button").each(function () {
        $(this).on("click", function (e) {
          e.preventDefault();
          $(this).parent().parent().parent().find(".sort-list").each(function () {
            var playlist = $(this).find("li");
            for (let i = 0, j = playlist.length - 1; i < j;) {
              var l = playlist.eq(i).clone(true);
              var r = playlist.eq(j).replaceWith(l);
              playlist.eq(i).replaceWith(r);
              ++i;
              --j;
            }
          });
        });
      });
    },
    'Search': function () {
      $(".search-select p,.search-select li").click(function () {
        var action = $(this).attr("data-action");
        $("#search").attr("action", action);
        $(".search-select .text").text($(this).html());
      });
      $(".search_submit").click(function () {
        var value = $(".search_wd").val();
        if (!value) {
          var wd = $(".search_wd").attr("placeholder");
          $(".search_wd").val(wd);
        }
      });
      $(".open-search").click(function () {
        var seacrhBox = $(".search-box");
        seacrhBox.addClass("active").siblings().hide();
        seacrhBox.find(".form-control").focus();
        seacrhBox.find(".head-dropdown").toggle();
        $(".search-close").click(function () {
          seacrhBox.removeClass("active").siblings().show();
          seacrhBox.find(".dropdown-box").hide();
        });
      });
    },
    'Collapse': function () {
      $(".text-collapse").each(function () {
        $(this).find(".details").on("click", function () {
          $(this).parent().find(".sketch").addClass("hide");
          $(this).parent().find(".data").css("display", "");
          $(this).remove();
        });
      });
    },
    'Scrolltop': function () {
      var a = $(window);
      $scrollTopLink = $("a.backtop");
      a.scroll(function () {
        500 < $(this).scrollTop() ? $scrollTopLink.css("display", "") : $scrollTopLink.css("display", "none");
      });
      $scrollTopLink.on("click", function () {
        $("html, body").animate({
          scrollTop: 0
        }, 400);
        return true;
      });
    },
    'Slidedown': function () {
      var display = $('.slideDown-box');
      $(".slideDown-btn").click(function () {
        if (display.css('display') == 'block') {
          display.slideUp("slow");
          $(this).html('展开  <i class="fa fa-angle-down"></i>');
          MyTheme.Mobile.Nav.Init();
        } else {
          display.slideDown("slow");
          $(this).html('收起   <i class="fa fa-angle-up"></i>');
          MyTheme.Mobile.Nav.Init();
        }
      });
    },
    'History': {
      'Init': function () {
        if ($(".vod_history").length) {
          var $that = $(".vod_history");
          MyTheme.Other.History.Set($that.attr('data-name'), $that.attr('data-link'), $that.attr('data-pic'), $that.attr('data-part'), $that.attr('data-limit'));
        }
      },
      'Set': function (name, link, pic, part, limit) {
        if (!link) {
          link = document.URL;
        }
        var history = MyTheme.Cookie.Get("history");
        var len = 0;
        var canadd = true;
        if (history) {
          history = eval("(" + history + ")");
          len = history.length;
          $(history).each(function () {
            if (name == this.name) {
              canadd = false;
              var json = "[";
              $(history).each(function (i) {
                var temp_name, temp_img, temp_url, temp_part;
                if (this.name == name) {
                  temp_name = name;
                  temp_img = pic;
                  temp_url = link;
                  temp_part = part;
                } else {
                  temp_name = this.name;
                  temp_img = this.pic;
                  temp_url = this.link;
                  temp_part = this.part;
                }
                json += "{\"name\":\"" + temp_name + "\",\"pic\":\"" + temp_img + "\",\"link\":\"" + temp_url + "\",\"part\":\"" + temp_part + "\"}";
                if (i != len - 1)
                  json += ",";
              });
              json += "]";
              MyTheme.Cookie.Set('history', json, 365);
              return false;
            }
          });
        }
        if (canadd) {
          var json = "[";
          var start = 0;
          var isfirst = "]";
          isfirst = !len ? "]" : ",";
          json += "{\"name\":\"" + name + "\",\"pic\":\"" + pic + "\",\"link\":\"" + link + "\",\"part\":\"" + part + "\"}" + isfirst;
          if (len > limit - 1)
            len -= 1;
          for (i = 0; i < len - 1; i++) {
            json += "{\"name\":\"" + history[i].name + "\",\"pic\":\"" + history[i].pic + "\",\"link\":\"" + history[i].link + "\",\"part\":\"" + history[i].part + "\"},";
          }
          if (len > 0) {
            json += "{\"name\":\"" + history[len - 1].name + "\",\"pic\":\"" + history[len - 1].pic + "\",\"link\":\"" + history[len - 1].link + "\",\"part\":\"" + history[len - 1].part + "\"}]";
          }
          MyTheme.Cookie.Set('history', json, 365);
        }
      }
    },
    'Player': function () {
      if ($("#player-left").length) {
        var PlayerLeft = $("#player-left");
        var PlayerSide = $("#player-sidebar");
        var LeftHeight = PlayerLeft.outerHeight();
        //var Position = $("#playlist li.active").position().top;
        $("#player-sidebar-is").click(function () {
          PlayerSide.toggle();
          if (PlayerSide.css("display") === 'none') {
            PlayerLeft.css("width", "100%");
            $(this).html("<i class='fa fa-angle-left'></i>");
          }
          if (PlayerSide.css("display") === 'block') {
            PlayerLeft.css("width", "");
            $(this).html("<i class='fa fa-angle-right'></i>");
          }
        });
        if (!MyTheme.Browser.useragent.mobile) {
          PlayerSide.css({
            "height": LeftHeight,
            "overflow": "auto"
          });
          //PlayerSide.scrollTop(Position);
        }
      }
      if ($(".player-fixed").length) {
        if (!MyTheme.Browser.useragent.mobile) {
          $(window).scroll(function () {
            if ($(window).scrollTop() > window.outerHeight) {
              $(".player-fixed").addClass("fixed fadeInDown");
              $(".player-fixed-off").show();

            } else if ($(window).scrollTop() < window.outerHeight) {
              $(".player-fixed").removeClass("fixed fadeInDown");
              $(".player-fixed-off").hide();
            }
          });
        }
        $(".player-fixed-off").click(function () {
          $(".player-fixed").removeClass("fixed fadeInDown");
        });
      }

    },
    'Close': function () {
      $(".close-btn").on("click", function () {
        $(this).parents(".close-box").remove();
      });
    },
    'Roll': function (obj, higt) {
      setInterval(function () {
        $(obj).find("ul").animate({
          marginTop: higt,
        }, 500, function () {
          $(this).css({
            marginTop: "0px"
          }).find("li:first").appendTo(this);
        })
      }, 3000);
    },
    'Share': function () {
      if (".bdshare".length) {
        window._bd_share_config = {
          common: {
            bdText: '',
            bdDesc: '',
            bdUrl: '',
            bdPic: ''
          },
          share: [{
            "bdSize": 24,
            bdCustomStyle: myui.tpl + 'statics/css/mytheme-share.css'
          }]
        }
        with(document) 0[(getElementsByTagName("head")[0] || body).appendChild(createElement('script')).src = '' + myui.bdapi + '?cdnversion=' + ~(-new Date() / 36e5)];
      }
    }
  }
};
MAC.Star.Init = function () {
  //不能用data-score，这是默认参数，会使动态设置的数值无效
  var $that = $('.mac_star');
  if ($that.length == 0) {
    return;
  }
  MAC.Ajax(maccms.path + '/index.php/ajax/score?mid=' + $that.attr('data-mid') + '&id=' + $that.attr('data-id'), 'get', 'json', '', function (e) {
    $that.attr({
      'score': e.data.score,
      'data-star': Math.ceil(e.data.score / 2)
    });
    $(".raty-score-num").text(e.data.score);
    $that.raty({
      starType: 'li',
      number: 5,
      numberMax: 5,
      space: false,
      score: function () {
        $(".raty-score-num").text($that.attr('score'));
        return $that.attr('data-star');
      },
      hints: ['很差', '较差', '还行', '推荐', '力荐'],
      starOff: 'fa fa-star-o',
      starOn: 'fa fa-star',
      target: $("#ratewords"),
      targetKeep: e.data.score_num > 0 ? true : false,
      targetText: '暂无评分',
      click: function (score, evt) {
        MAC.Ajax(maccms.path + '/index.php/ajax/score?mid=' + $that.attr('data-mid') + '&id=' + $that.attr('data-id') + '&score=' + (score * 2), 'get', 'json', '', function (r) {
          if (r.code == 1) {
            $that.attr({
              'score': r.data.score,
              'data-star': Math.ceil(r.data.score / 2)
            });
            $(".raty-score-num").text(r.data.score);
            $that.raty('set', {
              'score': Math.ceil(r.data.score / 2),
              'targetKeep': r.data.score_num > 0 ? true : false,
            });
            MAC.Pop.Msg(100, 20, '评分成功', 1000);
          } else {
            $that.raty('score', $that.attr('data-star'));
            MAC.Pop.Msg(100, 20, r.msg, 1000);
          }
        }, function () {
          $that.raty('score', $that.attr('data-star'));
          MAC.Pop.Msg(100, 20, '网络异常', 1000);
        });
      }
    });

  });
}
$(function () {
  if (MyTheme.Browser.useragent.mobile) {
    MyTheme.Mobile.Nav.Init();
    MyTheme.Mobile.Mshare();
  }
  MyTheme.Images.Lazyload();
  MyTheme.Images.Flickity.Init();
  MyTheme.Link.Copy.Init();
  MyTheme.Link.Short();
  MyTheme.Other.Bootstrap();
  MyTheme.Other.Sort();
  MyTheme.Other.Headroom();
  MyTheme.Other.Search();
  MyTheme.Other.Collapse();
  MyTheme.Other.Slidedown();
  MyTheme.Other.Scrolltop();
  MyTheme.Other.History.Init();
  MyTheme.Other.Player();
  MyTheme.Other.Close();
});
