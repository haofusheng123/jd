enum netOption {
    // host="haofusheng.xyz",
    host="localhost",
    port="3000",
    basePath=""
}

export default "http://"+netOption.host+":"+netOption.port+netOption.basePath;