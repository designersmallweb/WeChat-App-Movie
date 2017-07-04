var postsData = require('../../../data/posts-data.js');
var app = getApp();
Page({
	data: {},
	onLoad: function (option) {
		var postId = option.id;
		var postData = postsData.local_database[postId];
		this.setData({
			postData: postData,
			currentPostId: postId,
			isPlayingMusic: false
		});
		var article_collected_value = wx.getStorageSync('article_collected');
		if (article_collected_value) {
			var collection_state = article_collected_value[postId];
			this.setData({
				collected: collection_state
			})
		} else {
			var article_collected_value = {};
			article_collected_value[postId] = false;
			wx.setStorageSync('article_collected', article_collected_value);
		};
		if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
			this.setData({
				isPlayingMusic: true
			})
		};
		this.setMusicMonitor();
	},
	setMusicMonitor: function () {
		var that = this;
		wx.onBackgroundAudioPlay(function () {




			var pages = getCurrentPages();
			var currentPage = pages[pages.length - 1];
			if (currentPage.data.currentPostId === that.data.currentPostId) {
				if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
					that.setData({
						isPlayingMusic: true
					})
				}
			}
			app.globalData.g_isPlayingMusic = true;







			// that.setData({
			// 	isPlayingMusic: true
			// })
			// app.globalData.g_isPlayingMusic = true;
			// app.globalData.g_currentMusicPostId = that.data.currentPostId;
		});
		wx.onBackgroundAudioPause(function () {


			var pages = getCurrentPages();
			var currentPage = pages[pages.length - 1];
			if (currentPage.data.currentPostId === that.data.currentPostId) {
				if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
					that.setData({
						isPlayingMusic: false
					})
				}
			}
			app.globalData.g_isPlayingMusic = false;
			// app.globalData.g_currentMusicPostId = null;












			// that.setData({
			// 	isPlayingMusic: false
			// })
			// app.globalData.g_isPlayingMusic = false;
			//app.globalData.g_currentMusicPostId = null;
		});
		wx.onBackgroundAudioStop(function () {
			that.setData({
				isPlayingMusic: false
			})
			app.globalData.g_isPlayingMusic = false;
			//app.globalData.g_currentMusicPostId = null;
		})
	},
	onCollectionTap: function () {
		this.getPostsCollectedSyc();
	},
	/*getPostsCollectedAsy:function() {
		var that=this;
		wx.getStorage({
			key:"article_collected",
			success:function(res) {
				var article_collected_value=res.data;
				var collection_state=article_collected_value[that.data.currentPostId];
				collection_state=!collection_state;
				article_collected_value[that.data.currentPostId]=collection_state;
				that.showToast(article_collected_value,collection_state);
			}
		})
	},*/
	getPostsCollectedSyc: function () {
		var article_collected_value = wx.getStorageSync('article_collected');
		var collection_state = article_collected_value[this.data.currentPostId];
		collection_state = !collection_state;
		article_collected_value[this.data.currentPostId] = collection_state;
		this.showToast(article_collected_value, collection_state);
	},
	showToast: function (article_collected_value, collection_state) {
		wx.setStorageSync('article_collected', article_collected_value);
		this.setData({
			collected: collection_state
		});
		wx.showToast({
			title: collection_state ? "收藏成功" : "取消成功",
			duration: 1000,
			icon: "success"
		})
	},
	onShareTap: function (event) {
		var itemList = [
			"分享给微信好友",
			"分享到朋友圈",
			"分享到QQ",
			"分享到微博"
		];
		wx.showActionSheet({
			itemList: itemList,
			itemColor: "#405f80",
			success: function (res) {
				wx.showModal({
					title: "用户" + itemList[res.tapIndex],
					content: "用户是否取消？" + res.cancel + "AAA"
				})
			}
		})
	},
	onMusicTap: function () {
		var currentPostId = this.data.currentPostId;
		var postData = postsData.local_database[currentPostId];
		var isPlayingMusic = this.data.isPlayingMusic;
		if (isPlayingMusic) {
			wx.pauseBackgroundAudio();
			this.setData({
				isPlayingMusic: false
			})
		} else {
			wx.playBackgroundAudio({
				dataUrl: postData.music.url,
				title: postData.music.title,
				coverImgUrl: postData.music.coverImg
			})
			this.setData({
				isPlayingMusic: true
			})
			app.globalData.g_currentMusicPostId = this.data.currentPostId;
            app.globalData.g_isPlayingMusic = true;
		}
	}
})