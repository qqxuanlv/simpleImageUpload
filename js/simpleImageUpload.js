var myFileUpload = newFunction()
 
function newFunction() {
    return {
        tmpFile: null,
        formUploadData: null,
        insertBtn: null,
        insertBtn2: null,
        initCapacity:5,
        init: function (capacity) {

            if(capacity != null ){
                if(parseInt(capacity)>0){
                    this.initCapacity=capacity;
                }
            } 
            this.formUploadData = new FormData();
            $("#filePosition").append(`
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">
                            图片上传
                        </h3>
                    </div>
                    <div id="formUpload" class="panel-body">
                        <div class="fileAdd">
                        </div>
                    </div>
                </div>
                
                <input id="multipleFile" style="display: none" name="file" accept="image/*" type="file">
                <button class="fileAdd btn btn-success pull-right btn2" style="display: none">选择文件</button>`);
            this.tmpFile = $("#multipleFile");
            this.insertBtn = $("div.fileAdd");
            this.insertBtn2 = $("button.fileAdd");
            $(".fileAdd").click(function () {
                $("#multipleFile").click();
            });
            let that = this;
            $("#multipleFile").change("propertychange", function (e) {
                if ($(this)[0].files == null)
                    return;
                let fileItem = $(this)[0].files[0];
                //回显操作
                //添加操作
                let newFileName = that.rename(fileItem.name);
                fileItem.name = newFileName.name;
                let newNameFile = new File([fileItem], newFileName.name);
                
                let capacityCount=0;
                for (kes of that.formUploadData.entries()) {
                    capacityCount++;
                }
                if(capacityCount>=that.initCapacity){
                    console.log("已经达到最大容量");
                    return ; 
                }
                
                that.formUploadData.append(newFileName.hash, newNameFile);



                //上传按钮
                let fileCount = 0;
                for (kes of that.formUploadData.entries()) {
                    fileCount++;
                }
                if (fileCount > 0) {
                    that.insertBtn.hide();
                    that.insertBtn2.show();
                }
                else {
                    console.log(fileCount);
                    that.insertBtn.show();
                    that.insertBtn2.hide();
                }
                that.insertImg(fileItem, newFileName.hash);
                that.tmpFile.files = null;
            });
        },
        getFilesMap: function () {
            let map = new Map();
            for (item of this.formUploadData.entries()) {
                map.set(item[0], item[1]);
            }
            return map;
        },
        getFilesArray: function () {
            let array = new Array();
            for (item of this.formUploadData.entries()) {
               array.push(item[1]);
            }
            return array;
        },
        upload: function (methodProxy) {
            let array = this.getFilesArray();
            if (array.length < 1) {
                console.log("需要添加文件");
                throw "当前文件为空";
            }
            methodProxy(array);
        },
        insertImg: function (file, hash) {
            if (file == null)
                throw "文件回显：文件不能为空!";
            let that = this;
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadstart = function () {
           
            };
            reader.onload = function (e) {
                let newDom = `<div class="img-container"> <img    src="` + reader.result + `"> <div class="operate" style="display:none"> <div class="removeIcon" onclick="myFileUpload.removeFile(this,'` + hash + `')"> </div> </div></div>`;
                $("#formUpload").append(newDom);
                that.bindHover();
            };
            that.tmpFile.val("");
        },
        rename: function (txt) {
            function guid2() {
                function S4() {
                    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                }
                return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
            }
            function getExt(txt) {
                return txt.substring(txt.lastIndexOf("."));
            }
            let hash = guid2();
            return { hash: hash, name: hash + getExt(txt) };
        },
        removeFile: function (dom, hash) {
            $(dom).parents(".img-container").remove();
            this.formUploadData.delete(hash);
            let count = 0;
            for (item of this.formUploadData.keys()) {
                count++;
            }
            if (count == 0) {
                this.insertBtn.show();
                this.insertBtn2.hide();
            }
        },
        bindHover: function () {
            $(".img-container").hover(function () {
                $(this).find(".operate").show();
            }, function () {
                $(this).find(".operate").hide();
            });
        }
    };
}
 
myFileUpload.init();
