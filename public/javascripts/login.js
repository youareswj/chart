;
!(function ($,global,undefined){
    var login = function (obj){};
    login.prototype = {
        register:function (){
            //检查昵称是否可用
            var user = arguments[0];
            this._ajax('/test',{user:user},'get',function (res){
                if(res.success=='false'){
                    $('.confirm').fadeIn('slow');
                }else if(res.success=='success'){
                    var sty = $('.confirm').css('display');
                    if(sty=='block'){
                        $('.confirm').fadeOut('slow');
                    }
                }
            })
        },
        sub:function(){
            //用户注册
            var _self = this;
            var user = $('#user').val();
            var pwd = $('#pwd').val();
            var pic = $('#avatar').attr('pic');
            var sex = $('input[name="sex"]:checked').val();
            var address = $('#address').val();
            var perShow = $('#perShow').val();
            var sty = $('.confirm').css('display');
            if(sty=='block'){
                this.speak('不可用昵称！');
                return false;
            }
            if(user==""||pwd==""){
                this.speak('请输入昵称或者密码！');
                return false;
            }
            if(address==""){
                address = '保密'
            } 
            if(pic==''){
                pic = 'unlogin.png'
            }
            if(perShow==''){
                perShow = 'Ta没有留下什么介绍'
            }
            if(sex==undefined){
                sex = '保密'
            }
            var data = {
                userName:user,
                password:pwd,
                pic:pic,
                sex:sex,
                address:address,
                perShow:perShow
            }
            _self._ajax('/login_user',data,'post',function (res){
                if(res.success==true){
                    _self.speak(res.msg,function (){
                        window.location.href='/login';
                    });
                }
            })
        },
        u_login:function(){
            var _self = this;
            var u = arguments[0];
            var p = arguments[1];
            _self._ajax('/log_session','','get',function (res){
                if(res.userName==u){
                    _self.speak('不要重复登录  ￣ω￣=',function (){
                        var url = '/user?id='+res.userId;
                        window.open(url,'_self');
                        return false;
                    });
                }else{
                    _self._ajax('/login_test',{userName:u,pwd:p},'post',function (res){
                        if(res.success==false){
                            _self.speak(res.msg);
                        }else{
                            var jump = window.location.href.split('prev=')[1];
                            if(jump){
                                window.location.href = jump;
                            }else{
                                window.location.href = '/user?id='+res.userId;
                            }
                        }
                    })
                }
            });
        },
        _ajax:function (url,data,type,callback){
            $.ajax({
                url:url,
                data:data,
                type:type,
                dataType:'json',
                success:function (res){
                    callback(res);
                }
            })
        },
        speak:function (){
            var txt = arguments[0];
            var fun = arguments[1];
            $('body').append('<div class="mask"></div>\n' +
                '<div class="dialog">\n' +
                '    <div class="dia_c">'+txt+'</div>\n' +
                '    <div class="dia_b"><i></i></div>\n' +
                '</div>');
            $(document).on('click','.dialog .dia_b i',function (){
                $('.mask').fadeOut('fast',function (){
                    $(this).remove()
                });
                for(var i =0;i<2;i++){
                    $('.dialog').animate({top:(60+2.5*i)+'vw'},100);
                    $('.dialog').animate({top:(80-2.5*i)+'vw'},100);
                };
                setTimeout(function (){
                    $('.dialog').remove();
                },300);
                if(fun){
                    fun();
                }
            })
        },
        choose:function (){
            var pic = "";
            $('body').append('<div class="mask"></div>\n' +
                '<div class="dialog_pic"><i class="close"></i>' +
                '<div class="dia_pic"><ul>' +
                '<li><a href="javascript:void(0)"><img src="../avatar/jay.jpg" ></a></li>' +
                '<li><a href="javascript:void(0)"><img src="../avatar/panda.png" ></a></li>' +
                '<li><a href="javascript:void(0)"><img src="../avatar/luffy.png" ></a></li>' +
                '<li><a href="javascript:void(0)"><img src="../avatar/hancock.png" ></a></li>' +
                '<li><a href="javascript:void(0)"><img src="../avatar/zoro.png" ></a></li>' +
                '<li><a href="javascript:void(0)"><img src="../avatar/nami.png" ></a></li>' +
                '<li><a href="javascript:void(0)"><img src="../avatar/elephant.png" ></a></li>' +
                '<li><a href="javascript:void(0)"><img src="../avatar/giraffe.png"></a></li>' +
                '<li><a href="javascript:void(0)"><img src="../avatar/octopus.png" ></a></li>' +
                '<li><a href="javascript:void(0)"><img src="../avatar/shyguy.png" ></a></li>' +
                '<li><a href="javascript:void(0)"><img src="../avatar/mai.png" ></a></li>' +
                '<li><a href="javascript:void(0)"><img src="../avatar/hippo.png" ></a></li>' +
                '</ul><div class="clear"></div></div>\n' +
                '    <div class="dia_b"><i></i></div>\n' +
                '</div>');
            $(document).on('click','.dialog_pic .dia_pic li a',function (){
                $(this).parent().siblings().removeClass('on');
                $(this).parent().addClass('on');
                var sty = $('.dialog_pic .dia_b').css('display');
                if(sty=='none') $('.dialog_pic .dia_b').show();
                pic = $(this).find('img').attr('src').split('/')[2];
            });
            $(document).on('click','.dialog_pic .dia_b i',function (){
                $('.mask').fadeOut('fast',function (){
                    $(this).remove()
                });
                for(var i =0;i<2;i++){
                    $('.dialog_pic').animate({top:(60+2.5*i)+'vw'},100);
                    $('.dialog_pic').animate({top:(80-2.5*i)+'vw'},100);
                };
                setTimeout(function (){
                    $('.dialog_pic').remove();
                },300);
                $('.avatar_u input').attr('pic',pic);
                var src = '../avatar/'+pic;
                $('.avatar_u  .sel img').attr('src',src);
            })
            $(document).on('click','.dialog_pic i.close',function (){
                $('.mask').fadeOut('fast',function (){
                    $(this).remove()
                });
                for(var i =0;i<2;i++){
                    $('.dialog_pic').animate({top:(60+2.5*i)+'vw'},100);
                    $('.dialog_pic').animate({top:(80-2.5*i)+'vw'},100);
                };
                setTimeout(function (){
                    $('.dialog_pic').remove();
                },300);
            })
        }
    }
    this.Login = login;
})(jQuery,this)