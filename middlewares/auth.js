const auth=function(req,res,next){
    if(!req.header('authorization') || !req.header('id') ){
        var err=new Error("not authenticated");
        next(err);
          }
          const token=req.header('authorization');
          if(token==process.env.accessToken){
            next();
        
          }
          else{

            var err=new Error("not authenticated");
            next(err);

          }

}
module.exports=auth;