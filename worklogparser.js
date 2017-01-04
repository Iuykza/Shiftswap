var posts = [];
var regexPostMarker = \^\[.*?\]$\;
var regexTime = \\d{4}-\d{2}-\d{2}\;
var regexDate = \\d{2}:\d{2}:\d{2}\;

while(){
    var post = {};
    //1. Strip file by timestamps.  These look something like this:
    //[Josh @ 2016-12-31 15:32:02]
    var stamp = regex.match();

    //2. Further strip data from timestamps.
    post.time = stamp.match(regexTime);
    post.date = stamp.match(regexDate);

    //3. Find content between stamps.
    post.content = ...;


    //4. Save into array containing each post.  Where array takes the form:
    /*
        posts = [
            {post} => {time, date, content},
            {post} => {...},
            ...
        ];
    */
    
    posts.push(post);
}