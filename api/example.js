
function ExampleApi()
{
   //传参数，获取我的名字，请注意这个范例
				
    this.hello = function(request_json,callback){
        $.ajax(dataapi_link+'/example/hello',{
					//提交数据的类型 POST GET
					type:'POST',
					async:true,
					data:request_json,
					beforeSend:apiconfig_beforeSend, //发送请求
					complete:apiconfig_complete,//请求完成
					crossDomain:true,
					datatype: 'json',//xml, html, script, json, jsonp, text
					xhrFields: {  withCredentials: true  },
					//成功返回之后调用的函数             
					success:callback
				 });
    };


}