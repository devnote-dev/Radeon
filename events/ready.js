exports.run = async client => {
    console.log('Radeon is Ready!');
    client.user.setActivity('Radeon: Revamped 😎', {type:'PLAYING'});
    client.channels.cache.get(client.config.logs.status).send({embed:{description:'Radeon is Ready!',color:0x63d01b}});
}
