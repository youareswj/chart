;
!(function ($){
    $.user = function (obj){
        var _obj = {
            page: obj.page,
            uid: obj.uid,
            phone: obj.phone,
            selector: obj.selector
        };
        Vue.filter('dealsex', function (val){
            if(val == 0){
                return '女'
            } else if(val == 1){
                return '男'
            }
        });
        Vue.filter('time', function (val){
            if(val){
                return val.substring(10);
            }
        });
        _obj.vm = new Vue({
            el: ".contain",
            data: {
                logn_state: '',    //登录状态
                logn_id: '',       //登录用户id
                logn_na: '',       //登录用户昵称
                logn_pic: '',       //登录头像
                u_msg: [],         //用户资料
                think: [],          //think
                comment: [],        //评论
                tips: '',            //提示
                topics: '',           //话题
                tpcList: []           //话题相关讨论
            },
            created: function (){
                this.status();
            },
            watch: {
                think: function (val, old){
                    var _self = this;
                    this.$nextTick(function (){
                        if(!_obj.vm.logn_state){
                            return false
                        } else{
                            var userid = _obj.vm.logn_id;
                            if(_obj.page == 'topic'){
                                _self._ajax('/thkpra', {uid: userid}, 'get', function (result){
                                    if(result.success == true){
                                        var pra = result.data;
                                        var thk = val;
                                        for(var a in pra){
                                            var tid = pra[a].thID;
                                            for(var b in thk){
                                                if(thk[b]._id == tid){
                                                    _obj.vm.$set(_obj.vm.think[b], 'type', pra[a].type);
                                                }
                                            }
                                        }
                                    }
                                })
                            } else{
                                _self._ajax('/praList', {uid: userid}, 'get', function (result){
                                    if(result.success == true){
                                        var pra = result.data;
                                        var thk = val;
                                        for(var a in pra){
                                            var tid = pra[a].thID;
                                            for(var b in thk){
                                                if(thk[b]._id == tid){
                                                    _obj.vm.$set(_obj.vm.think[b], 'type', pra[a].type);
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    })
                },
            },
            methods: {
                getData: function (){           //获取用户信息
                    this._ajax('/get_user', {uid: _obj.uid}, 'get', function (res){
                        _obj.vm.u_msg = res.data;
                    })
                },
                getThk: function (){             //获取用户心情
                    this._ajax('/u_com', {uid: _obj.uid}, 'get', function (res){
                        if(res.success == true){
                            _obj.vm.think = res.data;
                            _obj.vm.tips = false;
                        } else{
                            _obj.vm.tips = '来写下你的第一条动态吧! (ಥ_ಥ)';
                        }
                    })
                },
                index: function (){             //获取首页心情
                    this._ajax('/list', {uid: _obj.uid}, 'get', function (res){
                        if(res.success == true){
                            _obj.vm.think = res.data;
                            _obj.vm.tips = false;
                        } else{
                            _obj.vm.tips = '来写下你的第一条动态吧! (ಥ_ಥ)';
                        }
                    })
                },
                topic: function (){                //获取话题
                    var _self = this;
                    var pid = window.location.href.split('?pid=')[1];
                    _self._ajax('/tpclist', {pid: pid}, 'get', function (res){
                        if(res.success == true){
                            _obj.vm.topics = res.data[0].title;
                        }
                    })
                },
                getTpk: function (){
                    var pid = window.location.href.split('?pid=')[1];
                    this._ajax('/getTpk', {pid: pid}, 'get', function (res){
                        if(res.success == true){
                            _obj.vm.think = res.data;
                            _obj.vm.tips = false;
                        } else{
                            _obj.vm.tips = '来参与讨论吧 (ಥ_ಥ)';
                        }
                    })
                },
                status: function (){             //判断登录状态
                    this._ajax('/log_session', '', 'get', function (res){
                        if(res.userId !== null){
                            _obj.vm.logn_state = true;
                            _obj.vm.logn_id = res.userId;
                            _obj.vm.logn_na = res.userName;
                            _obj.vm.logn_pic = res.pic;
                        }
                    });
                },
                logout: function (){                //注销
                    var _self = this;
                    if(!_obj.vm.logn_state){
                        _self.speak('你还没有登录...');
                    } else{
                        _self.confirm('是否退出登录?', function (){
                            _self._ajax('/logout', '', 'get', function (res){
                                if(res.success == true){
                                    setTimeout(function (){
                                        _self.speak('退出成功', function (){
                                            window.location.reload();
                                        });
                                    }, 1000)
                                } else{
                                    _self.speak(res.msg);
                                }
                            });
                        })
                    }
                },
                pointOut: function (){
                    if(!_obj.vm.logn_state){
                        this.confirm('请先登录!', function (){
                            var cur_url = window.location.href;
                            window.open('/login?prev=' + cur_url, '_self');
                            return false;
                        })
                    }
                },
                praise: function (type, el){      //点赞
                    var _self = this;
                    if(!_obj.vm.logn_state){
                        _self.confirm('请先登录!', function (){
                            var cur_url = window.location.href;
                            window.open('/login?prev=' + cur_url, '_self');
                            return false;
                        })
                    } else{
                        if(el.target.localName == "i"){
                            _el = el.target.parentNode;
                        } else{
                            _el = el.target;
                        }
                        var n = $(_el).attr('class');
                        var tid = $(_el).parent().parent().attr('thId');
                        var uid = _obj.vm.logn_id;
                        if(type == 1){
                            var o = $(_el).next().attr('class');
                            if(o == 'selUag'){
                                $(_el).next().attr('class', 'unagree');
                            }
                            if(o == 'unagree' && n == 'selAg'){
                                type = 0;
                            }
                            if(n == 'agree'){
                                $(_el).attr('class', 'selAg');
                            } else{
                                $(_el).attr('class', 'agree');
                            }
                        } else if(type == 2){
                            var o = $(_el).prev().attr('class');
                            if(o == 'agree' && n == 'selUag'){
                                type = 0;
                            }
                            if(o == 'selAg'){
                                $(_el).prev().attr('class', 'agree');
                            }
                            if(n == 'unagree'){
                                $(_el).attr('class', 'selUag');
                            } else{
                                $(_el).attr('class', 'unagree');
                            }
                        }
                        var data = {
                            uid: uid,
                            tid: tid,
                            type: type
                        }
                        _self._ajax('/praise', data, 'get');
                    }
                },
                tpcpra: function (type, el){      //话题点赞
                    var _self = this;
                    if(!_obj.vm.logn_state){
                        _self.confirm('请先登录!', function (){
                            var cur_url = window.location.href;
                            window.open('/login?prev=' + cur_url, '_self');
                            return false;
                        })
                    } else{
                        if(el.target.localName == "i"){
                            _el = el.target.parentNode;
                        } else{
                            _el = el.target;
                        }
                        var n = $(_el).attr('class');
                        var tid = $(_el).parent().parent().attr('thId');
                        var uid = _obj.vm.logn_id;
                        if(type == 1){
                            var o = $(_el).next().attr('class');
                            if(o == 'selUag'){
                                $(_el).next().attr('class', 'unagree');
                            }
                            if(o == 'unagree' && n == 'selAg'){
                                type = 0;
                            }
                            if(n == 'agree'){
                                $(_el).attr('class', 'selAg');
                            } else{
                                $(_el).attr('class', 'agree');
                            }
                        } else if(type == 2){
                            var o = $(_el).prev().attr('class');
                            if(o == 'agree' && n == 'selUag'){
                                type = 0;
                            }
                            if(o == 'selAg'){
                                $(_el).prev().attr('class', 'agree');
                            }
                            if(n == 'unagree'){
                                $(_el).attr('class', 'selUag');
                            } else{
                                $(_el).attr('class', 'unagree');
                            }
                        }
                        var data = {
                            tid: tid,
                            uid: uid,
                            type: type
                        }
                        _self._ajax('/tpkpra', data, 'get');
                    }
                },
                addCom: function (el){            //加载评论
                    var _self = this;
                    if(el.target.localName == "i"){
                        _el = el.target.parentNode.parentNode;
                    } else{
                        _el = el.target.parentNode;
                    }
                    var elm = _el.nextElementSibling;
                    var sty = elm.style.display;
                    if(sty == "none" || sty == ""){
                        elm.style.display = 'block';
                        var uid = $(elm).parent().attr('thId');
                        var txt = $(elm).find('.comment').text();
                        if(txt == ''){
                            if(_obj.page == 'topic'){
                                _self._ajax('/tpccList', {id: uid}, 'get', function (res){
                                    if(res.success == true){
                                        if(res.data.length == 0){
                                            $(elm).find('.comment').html(
                                                '<div class="empty">' +
                                                '暂时没有评论' +
                                                '</div>' +
                                                '<div class="clear"></div>');
                                        } else{
                                            $.each(res.data, function (i, item){
                                                $(elm).find('.comment').append('<div class="avatar">' +
                                                    '<a href="/user?id=' + item.userId + '" class="fl"><img src="/avatar/' + item.pic + '"></a>' +
                                                    '<div class="com_u">' + item.userName + '</div>' +
                                                    '<div class="clear"></div>' +
                                                    '</div>' +
                                                    '<div class="com">' +
                                                    '<div class="c_cont">' + item.comment + '</div>' +
                                                    '<div class="c_time">' + item.comTime.substring(10) + '</div>' +
                                                    '<div class="clear"></div>' +
                                                    '</div>' +
                                                    '<div class="clear"></div>');
                                            })
                                        }
                                    }
                                });
                            } else{
                                _self._ajax('/comList', {id: uid}, 'get', function (res){
                                    if(res.success == true){
                                        if(res.data.length == 0){
                                            $(elm).find('.comment').html(
                                                '<div class="empty">' +
                                                '暂时没有评论' +
                                                '</div>' +
                                                '<div class="clear"></div>');
                                        } else{
                                            $.each(res.data, function (i, item){
                                                $(elm).find('.comment').append('<div class="avatar">' +
                                                    '<a href="/user?id=' + item.userId + '" class="fl"><img src="/avatar/' + item.pic + '"></a>' +
                                                    '<div class="com_u">' + item.userName + '</div>' +
                                                    '<div class="clear"></div>' +
                                                    '</div>' +
                                                    '<div class="com">' +
                                                    '<div class="c_cont">' + item.comment + '</div>' +
                                                    '<div class="c_time">' + item.comTime.substring(10) + '</div>' +
                                                    '<div class="clear"></div>' +
                                                    '</div>' +
                                                    '<div class="clear"></div>');
                                            })
                                        }
                                    }
                                });
                            }
                        }
                    } else{
                        elm.style.display = 'none';
                    }
                },
                publish: function (el, thId){              //发表评论
                    var _self = this;
                    var cont = $(el.target).prev().val();
                    if(!_obj.vm.logn_state){
                        _self.confirm('请先登录!', function (){
                            var cur_url = window.location.href;
                            window.open('/login?prev=' + cur_url, '_self');
                            return false;
                        })
                    } else{
                        if(cont == ""){
                            _self.speak('请输入内容');
                            return false;
                        }
                        var time = _self.date();
                        var uid = _obj.vm.logn_id;
                        var tid = thId;
                        var data = {
                            uid: uid,
                            name: _obj.vm.logn_na,
                            pic: _obj.vm.logn_pic,
                            tid: tid,
                            time: time,
                            com: cont
                        }
                        if(_obj.page == 'topic'){
                            var pid = window.location.href.split('?pid=')[1];
                            data.pid = pid;
                            _self._ajax('/posttpcc', data, 'post', function (res){
                                if(res.success == true){
                                    _self.speak('评论成功', function (){
                                        $(el.target).prev().val('');
                                        var elm = $(el.target).parent().parent().prev();
                                        console.log($(elm).text());
                                        if($(elm).text() == '暂时没有评论'){
                                            $(elm).empty();
                                        }
                                        $(elm).append('<div class="avatar">' +
                                            '<a href="/user?uid=' + uid + '" class="fl"><img src="/avatar/' + _obj.vm.logn_pic + '"></a>' +
                                            '<div class="com_u">' + _obj.vm.logn_na + '</div>' +
                                            '<div class="clear"></div>' +
                                            '</div>' +
                                            '<div class="com">' +
                                            '<div class="c_cont">' + cont + '</div>' +
                                            '<div class="c_time">' + time.substring(10) + '</div>' +
                                            '<div class="clear"></div>' +
                                            '</div>' +
                                            '<div class="clear"></div>');
                                    });
                                }
                            })
                        } else{
                            _self._ajax('/postComt', data, 'post', function (res){
                                if(res.success == true){
                                    _self.speak('评论成功', function (){
                                        $(el.target).prev().val('');
                                        var elm = $(el.target).parent().parent().prev();
                                        console.log($(elm).text());
                                        if($(elm).text() == '暂时没有评论'){
                                            $(elm).empty();
                                        }
                                        $(elm).append('<div class="avatar">' +
                                            '<a href="/user?uid=' + uid + '" class="fl"><img src="/avatar/' + _obj.vm.logn_pic + '"></a>' +
                                            '<div class="com_u">' + _obj.vm.logn_na + '</div>' +
                                            '<div class="clear"></div>' +
                                            '</div>' +
                                            '<div class="com">' +
                                            '<div class="c_cont">' + cont + '</div>' +
                                            '<div class="c_time">' + time.substring(10) + '</div>' +
                                            '<div class="clear"></div>' +
                                            '</div>' +
                                            '<div class="clear"></div>');
                                    });
                                }
                            })
                        }
                    }
                },
                delCom: function (el){             //删除心情
                    var _self = this;
                    if(!_obj.vm.logn_state){
                        _self.confirm('请先登录!', function (){
                            var cur_url = window.location.href;
                            window.open('/login?prev=' + cur_url, '_self');
                            return false;
                        })
                    } else{
                        var _id = el.target.parentNode.parentNode.parentNode.getAttribute('thId');
                        _self._ajax('/remove', {id: _id}, 'get', function (res){
                            if(res.success == true){
                                _self.speak('删除成功', function (){
                                    _self.getThk();
                                });
                            }
                        })
                    }
                },
                edit: function (){             //加载心情编辑器
                    var _self = this;
                    if(!_obj.vm.logn_state){
                        _self.confirm('请先登录!', function (){
                            var cur_url = window.location.href;
                            window.open('/login?prev=' + cur_url, '_self');
                            return false;
                        })
                    } else{
                        $('body').append('<div class="mask"></div>' +
                            '<div class="diaedit">' +
                            '    <div class="dia_e"><textarea id="area"></textarea></div>' +
                            '    <div class="dia_b"><i class="cancel"></i><i class="sub"></i></div>' +
                            '</div>');
                        $(document).on('click', '.diaedit .dia_b .cancel', function (){
                            $('.mask').fadeOut('fast', function (){
                                $(this).remove()
                            });
                            for(var i = 0; i < 2; i++){
                                $('.diaedit').animate({top: (60 + 2.5 * i) + 'vw'}, 100);
                                $('.diaedit').animate({top: (80 - 2.5 * i) + 'vw'}, 100);
                            }
                            ;
                            setTimeout(function (){
                                $('.diaedit').remove();
                            }, 300);
                        })
                        $(document).one('click', '.diaedit .dia_b .sub', function (){
                            var thId = '3505';
                            var com = $('#area').val();
                            if(com.length == 0){
                                _self.speak('请输入内容!');
                                return false;
                            }
                            for(var i = 0; i < 5; i++){
                                thId += Math.floor(Math.random() * 10);
                            }
                            var date = _self.date();
                            _self._ajax('/postCom', {
                                uid: _obj.vm.logn_id,
                                name: _obj.vm.logn_na,
                                pic: _obj.vm.logn_pic,
                                thId: thId,
                                thTime: date,
                                thPhone: _obj.phone,
                                thCom: com
                            }, 'post', function (res){
                                if(res.success == true){
                                    $('.mask').remove();
                                    $('.diaedit').remove();
                                    _self.speak('发表成功!', function (){
                                        _self.getThk();
                                    });
                                }
                            })
                        })
                    }
                },
                ediTpk: function (){             //加载心情编辑器
                    var _self = this;
                    if(!_obj.vm.logn_state){
                        _self.confirm('请先登录!', function (){
                            var cur_url = window.location.href;
                            window.open('/login?prev=' + cur_url, '_self');
                            return false;
                        })
                    } else{
                        $('body').append('<div class="mask"></div>' +
                            '<div class="diaedit">' +
                            '    <div class="dia_e"><textarea id="area"></textarea></div>' +
                            '    <div class="dia_b"><i class="cancel"></i><i class="sub"></i></div>' +
                            '</div>');
                        $(document).on('click', '.diaedit .dia_b .cancel', function (){
                            $('.mask').fadeOut('fast', function (){
                                $(this).remove()
                            });
                            for(var i = 0; i < 2; i++){
                                $('.diaedit').animate({top: (60 + 2.5 * i) + 'vw'}, 100);
                                $('.diaedit').animate({top: (80 - 2.5 * i) + 'vw'}, 100);
                            }
                            ;
                            setTimeout(function (){
                                $('.diaedit').remove();
                            }, 300);
                        })
                        $(document).one('click', '.diaedit .dia_b .sub', function (){
                            var thId = '3505';
                            var com = $('#area').val();
                            if(com.length == 0){
                                _self.speak('请输入内容!');
                                return false;
                            }
                            for(var i = 0; i < 5; i++){
                                thId += Math.floor(Math.random() * 10);
                            }
                            var date = _self.date();
                            var pid = window.location.href.split('?pid=')[1];
                            let it = {
                                pid: pid,
                                uid: _obj.vm.logn_id,
                                name: _obj.vm.logn_na,
                                pic: _obj.vm.logn_pic,
                                thId: thId,
                                thTime: date,
                                thPhone: _obj.phone,
                                thCom: com
                            }
                            _self._ajax('/postTpk', {
                                pid: pid,
                                uid: _obj.vm.logn_id,
                                name: _obj.vm.logn_na,
                                pic: _obj.vm.logn_pic,
                                thId: thId,
                                thTime: date,
                                thPhone: _obj.phone,
                                thCom: com
                            }, 'post', function (res){
                                if(res.success == true){
                                    $('.mask').remove();
                                    $('.diaedit').remove();
                                    _self.speak('发表成功!', function (){
                                        _self.getTpk();
                                    });
                                }
                            })
                        })
                    }
                },
                tab: function (){              //tab切换
                    var selector = arguments[0];
                    $(selector).on('click', function (){
                        var i = $(this).index();
                        $(this).siblings().removeClass('on');
                        $(this).addClass('on');
                        $(this).parent().parent().parent().next().children().slideUp('slow');
                        $(this).parent().parent().parent().next().children("[tab=" + i + "]").slideDown('slow');
                    })
                },
                date: function (){          //获取当前时间
                    var date = new Date();
                    var cur_t = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
                    return cur_t;
                },
                speak: function (){
                    var txt = arguments[0];
                    var fun = arguments[1];
                    $('body').append('<div class="mask"></div>' +
                        '<div class="dialog">' +
                        '    <div class="dia_c">' + txt + '</div>' +
                        '    <div class="dia_b"><i></i></div>' +
                        '</div>');
                    $(document).on('click', '.dialog .dia_b i', function (){
                        $('.mask').fadeOut('fast', function (){
                            $(this).remove()
                        });
                        for(var i = 0; i < 2; i++){
                            $('.dialog').animate({top: (60 + 2.5 * i) + 'vw'}, 100);
                            $('.dialog').animate({top: (80 - 2.5 * i) + 'vw'}, 100);
                        }
                        ;
                        setTimeout(function (){
                            $('.dialog').remove();
                        }, 300);
                        if(fun){
                            fun();
                        }
                    })
                },
                confirm: function (){
                    var txt = arguments[0];
                    var fun = arguments[1];
                    $('body').append('<div class="mask"></div>' +
                        '<div class="diaconf">' +
                        '    <div class="conf_e">' + txt + '</div>' +
                        '    <div class="conf_b"><i class="cancel" id="cancel"></i><i class="yes" id="yes"></i></div>' +
                        '</div>');
                    $(document).one('click', '#cancel', function (){
                        $('.mask').fadeOut('fast', function (){
                            $(this).remove()
                        });
                        for(var i = 0; i < 2; i++){
                            $('.diaconf').animate({top: (60 + 2.5 * i) + 'vw'}, 100);
                            $('.diaconf').animate({top: (80 - 2.5 * i) + 'vw'}, 100);
                        }
                        ;
                        setTimeout(function (){
                            $('.diaconf').remove();
                        }, 300);
                    })
                    $(document).one('click', '#yes', function (){
                        $('.mask').fadeOut('fast', function (){
                            $(this).remove()
                        });
                        for(var i = 0; i < 2; i++){
                            $('.diaconf').animate({top: (60 + 2.5 * i) + 'vw'}, 100);
                            $('.diaconf').animate({top: (80 - 2.5 * i) + 'vw'}, 100);
                        }
                        ;
                        setTimeout(function (){
                            $('.diaconf').remove();
                        }, 300);
                        if(fun){
                            fun();
                        }
                    })
                },
                _ajax: function (surl, data, type, callback){
                    $.ajax({
                        url: surl,
                        data: data,
                        type: type,
                        dataType: 'json',
                        success: function (res){
                            if(callback){
                                callback(res);
                            }
                        }
                    })
                }
            }
        });
        var pageName = _obj.page;
        if(pageName == 'index'){
            _obj.vm.index();
        } else if(pageName == 'user'){
            _obj.vm.getData();
            _obj.vm.getThk();
            _obj.vm.tab(_obj.selector);
        } else if(pageName == 'topic'){
            _obj.vm.topic();
            _obj.vm.getTpk();
        }
    }
})(jQuery)