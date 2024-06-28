import "./index.less"
import CustomSearchInput from "../../../componets/CustomSearchInput/index.jsx";
import {useEffect, useRef, useState} from "react";
import CustomAccordion from "../../../componets/CustomAccordion/index.jsx";
import RightClickMenu from "../../../componets/RightClickMenu/index.jsx";
import IconMinorButton from "../../../componets/IconMinorButton/index.jsx";
import CustomLine from "../../../componets/CustomLine/index.jsx";
import CustomButton from "../../../componets/CustomButton/index.jsx";
import {useHistory} from "react-router-dom";
import CustomDragDiv from "../../../componets/CustomDragDiv/index.jsx";
import FriendApi from "../../../api/friend.js";
import {calculateAge, getDateDayAndMonth} from "../../../utils/date.js";
import {useDispatch} from "react-redux";
import {setCurrentChatId} from "../../../store/chat/action.js";
import ChatListApi from "../../../api/chatList.js";
import {setCurrentOption} from "../../../store/home/action.js";
import FriendSearchCard from "../../../componets/FriendSearchCard/index.jsx";
import CustomModal from "../../../componets/CustomModal/index.jsx";
import IconButton from "../../../componets/IconButton/index.jsx";
import UserApi from "../../../api/user.js";
import CustomEmpty from "../../../componets/CustomEmpty/index.jsx";
import NotifyApi from "../../../api/notify.js";
import CustomTextarea from "../../../componets/CustomTextarea/index.jsx";
import CustomInput from "../../../componets/CustomInput/index.jsx";
import GroupApi from "../../../api/group.js";
import CustomAffirmModal from "../../../componets/CustomAffirmModal/index.jsx";
import {useToast} from "../../../componets/CustomToast/index.jsx";
import CustomEditableText from "../../../componets/CustomEditableText/index.jsx";
import CustomDropdown from "../../../componets/CustomDropdown/index.jsx";
import CreateImageViewer from "../../ImageViewer/window.jsx";
import {getFileNameAndType} from "../../../utils/string.js";

export default function Friend() {
    const [selectedFriendId, setSelectedFriendId] = useState(null)
    const [groupMenuPosition, setGroupMenuPosition] = useState(null)
    const [addMenuPosition, setAddMenuPosition] = useState(null)
    const [moreMenuPosition, setMoreMenuPosition] = useState(null)
    const [allFriendData, setAllFriendData] = useState([])
    const h = useHistory()
    const [friendDetails, setFriendDetails] = useState(null)
    const dispatch = useDispatch();
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
    const [isAddFriendContentModalOpen, setIsAddFriendContentModalOpen] = useState(false);
    const showToast = useToast();

    //好友搜索
    const [searchInfo, setSearchInfo] = useState("")
    const [searchFriendsList, setSearchFriendsList] = useState([])
    //添加用户搜索
    const [searchUsersInfo, setSearchUsersInfo] = useState("")
    const [searchUsersList, setSearchUsersList] = useState([])
    const applyUserId = useRef()
    const [applyContent, setApplyContent] = useState("")
    //分组
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
    const [groupUpdateInfo, setGroupUpdateInfo] = useState(null)
    const [isGroupAdd, setIsGroupAdd] = useState(true)
    const selectedGroupId = useRef(null)
    const [isGroupDelAffirmModalOpen, setIsGroupDelAffirmModalOpen] = useState(false)
    const [isFriendDelAffirmModalOpen, setIsFriendDelAffirmModalOpen] = useState(false)
    const [groupList, setGroupList] = useState([])

    useEffect(() => {
        onFriendList()
        onGroupList()
    }, [])

    const onFriendList = () => {
        FriendApi.list().then(res => {
            if (res.code === 0) {
                setAllFriendData(res.data)
            }
        })
    }

    const [groupRightOptionsFilter, setGroupRightOptionsFilter] = useState([])
    const groupRightOptions = [
        {key: "addGroup", label: "添加分组"},
        {key: "modifyGroup", label: "重命名分组"},
        {key: "deleteGroup", label: "删除分组"}
    ]

    const addRightOptions = [
        {key: "addFriend", label: "添加好友"},
    ]

    const [moreRightOptionsFilter, setMoreRightOptionsFilter] = useState([])
    const moreRightOptions = [
        {key: "careFor", label: "特别关心"},
        {key: "unCaraFor", label: "取消特别关心"},
        {key: "delFriend", label: "删除好友"},
    ]

    const onFriendDetails = (friendId) => {
        if (friendId === selectedFriendId) return
        setSelectedFriendId(friendId)
        FriendApi.details(friendId).then(res => {
            if (res.code === 0) {
                setFriendDetails(res.data)
            }
        })
    }

    const onGroupList = () => {
        GroupApi.list().then(res => {
            if (res.code === 0) {
                setGroupList(res.data)
            }
        })
    }


    const onSendMsgClick = (friendId) => {
        ChatListApi.create({userId: friendId}).then(res => {
            if (res.code === 0) {
                dispatch(setCurrentChatId(friendId, res.data))
                dispatch(setCurrentOption("chat"))
                h.push("/home/chat")
            }
        })
    }

    useEffect(() => {
        if (searchInfo) {
            FriendApi.search({friendInfo: searchInfo}).then(res => {
                if (res.code === 0) {
                    setSearchFriendsList(res.data)
                }
            })
        }
    }, [searchInfo])

    useEffect(() => {
        if (searchUsersInfo) {
            UserApi.search({userInfo: searchUsersInfo}).then(res => {
                if (res.code === 0) {
                    setSearchUsersList(res.data)
                }
            })
        }
    }, [searchUsersInfo])

    let onAddMenuClick = (action) => {
        switch (action.key) {
            case "addFriend": {
                setIsAddFriendModalOpen(true)
                break
            }
        }
    }

    const onCreateGroup = () => {
        if (selectedGroupId.current) {
            GroupApi.update({groupId: selectedGroupId.current, groupName: groupUpdateInfo}).then(res => {
                if (res.code === 0) {
                    onFriendList()
                }
            })
        } else {
            GroupApi.create({groupName: groupUpdateInfo}).then(res => {
                if (res.code === 0) {
                    onFriendList()
                }
            })
        }
        setIsGroupModalOpen(false)
    }

    let onGroupMenuClick = (action) => {
        switch (action.key) {
            case "addGroup": {
                selectedGroupId.current = null
                setIsGroupAdd(true)
                setGroupUpdateInfo(null)
                setIsGroupModalOpen(true)
                break
            }
            case "modifyGroup": {
                setIsGroupAdd(false)
                setIsGroupModalOpen(true)
                break
            }
            case "deleteGroup": {
                setIsGroupDelAffirmModalOpen(true)
                break
            }
        }
    }

    let onMoreMenuClick = (action) => {
        switch (action.key) {
            case "careFor": {
                FriendApi.careFor({friendId: selectedFriendId}).then(res => {
                    if (res.code === 0) {
                        onFriendList()
                        setFriendDetails({...friendDetails, isConcern: true})
                    }
                })
                break
            }
            case "unCaraFor": {
                FriendApi.unCareFor({friendId: selectedFriendId}).then(res => {
                    if (res.code === 0) {
                        onFriendList()
                        setFriendDetails({...friendDetails, isConcern: false})
                    }
                })
                break
            }
            case "delFriend": {
                setIsFriendDelAffirmModalOpen(true)
                break
            }
        }
    }

    const onDeleteGroup = () => {
        if (selectedGroupId.current) {
            GroupApi.delete({groupId: selectedGroupId.current}).then(res => {
                if (res.code === 0) {
                    showToast("删除分组成功~")
                    onFriendList()
                }
            })
        }
        setIsGroupDelAffirmModalOpen(false)
    }

    const onDeleteFriend = () => {
        if (selectedFriendId) {
            FriendApi.delete({friendId: selectedFriendId}).then(res => {
                if (res.code === 0) {
                    showToast("好友删除成功~")
                    onFriendList()
                    setSelectedFriendId(null)
                    setFriendDetails(null)
                }
            })
        }
        setIsFriendDelAffirmModalOpen(false)
    }

    let onFriendApply = (userId, content) => {
        NotifyApi.friendApply({userId: userId, content: content}).then(res => {

        })
        setIsAddFriendContentModalOpen(false)
        setApplyContent("")
    }

    let onSetRemark = (friendId, remark) => {
        FriendApi.setRemark({friendId, remark}).then(res => {
            if (res.code === 0) {
                onFriendList()
                setFriendDetails({...friendDetails, remark: remark})
            }
        })
    }

    let onSetGroup = (friendId, option) => {
        FriendApi.setGroup({friendId, groupId: option.value}).then(res => {
            if (res.code === 0) {
                onFriendList()
                setFriendDetails({...friendDetails, groupName: option.label})
            }
        })
    }

    const FriendCard = ({info, onClick, onContextMenu}) => {
        let isSelected = info.friendId === selectedFriendId
        return (<div
            className={`friend-card ${isSelected ? "selected" : ""}`}
            onClick={() => onClick(info)}
            onContextMenu={(e) => {
                e.preventDefault()
                if (onContextMenu) onContextMenu(e)
            }}
        >
            <img className="friend-card-portrait" src={info.portrait}
                 alt={info.portrait}/>
            <div className="friend-card-content">
                <div className="friend-card-content-item">
                    <div
                        style={{
                            fontSize: 14, fontWeight: 600, color: `${isSelected ? "#FFF" : "1F1F1F"}`,
                        }}
                        className="ellipsis"
                    >
                        {info.remark ? info.remark + "（" + info.name + "）" : info.name}
                    </div>
                </div>
            </div>
        </div>)
    }

    return (
        <div className="friend">
            {/*好有添加弹窗*/}
            <div>
                <CustomModal
                    isOpen={isAddFriendModalOpen}
                >
                    <CustomModal
                        isOpen={isAddFriendContentModalOpen}
                        onClose={() => setIsAddFriendContentModalOpen(false)}
                    >
                        <div style={{
                            width: 300,
                            padding: 10,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}>
                            <CustomTextarea
                                height={100}
                                placeholder="请填写验证消息"
                                value={applyContent}
                                onChange={(v) => setApplyContent(v)}
                            >
                                <
                                    CustomButton
                                    onClick={() => onFriendApply(applyUserId.current, applyContent)}
                                >
                                    发送
                                </CustomButton>
                            </CustomTextarea>
                        </div>
                    </CustomModal>
                    <div className="user-search-modal">
                        <div className="user-search-modal-top">
                            <div style={{fontSize: 14}}>
                                添加好友
                            </div>
                            <div style={{position: "absolute", right: 0}}>
                                <IconButton
                                    danger
                                    icon={<i className={`iconfont icon-guanbi`} style={{fontSize: 20}}/>}
                                    onClick={() => setIsAddFriendModalOpen(false)}
                                />
                            </div>
                        </div>
                        <CustomSearchInput
                            value={searchUsersInfo}
                            onChange={(v) => setSearchUsersInfo(v)}
                            placeholder="账号/手机号/邮箱"
                        />
                        <div className="user-search-modal-content">
                            {searchUsersInfo ? (
                                searchUsersList.length > 0
                                    ?
                                    searchUsersList.map(user => (
                                        <div className="user-search-modal-content-item">
                                            <div style={{display: "flex"}}>
                                                <img
                                                    style={{width: 45, height: 45, borderRadius: 45}}
                                                    src={user.portrait}
                                                    alt={user.portrait}
                                                />
                                                <div style={{marginLeft: 10, fontSize: 14}}>
                                                    <div>
                                                        {user.name}
                                                    </div>
                                                    <div style={{fontSize: 12}}>
                                                        {user.account}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <CustomButton
                                                    style={{fontSize: 12, paddingTop: 0, paddingBottom: 0}}
                                                    width={36}
                                                    type="minor"
                                                    onClick={() => {
                                                        applyUserId.current = user.id
                                                        setIsAddFriendContentModalOpen(true)
                                                    }}
                                                >
                                                    添加
                                                </CustomButton>
                                            </div>
                                        </div>
                                    ))
                                    : <CustomEmpty placeholder="搜索的用户为不存在~"/>

                            ) : <CustomEmpty placeholder="请输入关键词吧~"/>
                            }
                        </div>
                    </div>
                </CustomModal>
            </div>
            {/*分组设置弹窗*/}
            <div>
                <CustomModal
                    isOpen={isGroupModalOpen}
                >
                    <div style={{
                        width: 300,
                        height: 120,
                        backgroundColor: "white",
                        borderRadius: 10,
                        padding: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                        justifyContent: "center"
                    }}>
                        <div style={{
                            display: "flex",
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: 30,
                            top: 5,
                            borderBottom: "#f1f1f1 1px solid"
                        }}>
                            <div style={{fontSize: 12}}>
                                {isGroupAdd ? "添加分组" : "修改分组"}
                            </div>
                            <div style={{position: "absolute", right: 10}}>
                                <IconButton
                                    danger
                                    icon={<i className={`iconfont icon-guanbi`} style={{fontSize: 20}}/>}
                                    onClick={() => {
                                        setIsGroupModalOpen(false)
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{width: "100%"}}>
                            <CustomInput
                                value={groupUpdateInfo}
                                placeholder="填写分组名称"
                                onChange={(v) => setGroupUpdateInfo(v)}
                            />
                        </div>
                        <div style={{display: "flex", position: "absolute", right: 10, bottom: 10}}>
                            <CustomButton
                                width={55}
                                disabled={!groupUpdateInfo}
                                onClick={onCreateGroup}
                            >
                                确定
                            </CustomButton>
                            <CustomButton
                                width={55}
                                type="minor"
                                onClick={() => {
                                    setIsGroupModalOpen(false)
                                }}
                            >
                                取消
                            </CustomButton>
                        </div>
                    </div>
                </CustomModal>
            </div>
            <CustomAffirmModal
                isOpen={isGroupDelAffirmModalOpen}
                txt="确认删除分组?"
                onOk={onDeleteGroup}
                onCancel={() => setIsGroupDelAffirmModalOpen(false)}
            />
            <CustomAffirmModal
                isOpen={isFriendDelAffirmModalOpen}
                txt="确认删除好友?"
                onOk={onDeleteFriend}
                onCancel={() => setIsFriendDelAffirmModalOpen(false)}
            />
            <RightClickMenu position={addMenuPosition} options={addRightOptions} onMenuItemClick={onAddMenuClick}/>
            <RightClickMenu position={groupMenuPosition}
                            options={groupRightOptions}
                            filter={groupRightOptionsFilter}
                            onMenuItemClick={onGroupMenuClick}
            />
            <RightClickMenu
                position={moreMenuPosition}
                options={moreRightOptions}
                filter={moreRightOptionsFilter}
                onMenuItemClick={onMoreMenuClick}
            />
            <div className="friend-list">
                <CustomDragDiv className="friend-list-top">
                    <label className="friend-list-top-title">
                        好友列表
                        <div className="friend-list-top-title-end"
                             onClick={(e) => setAddMenuPosition({x: e.clientX, y: e.clientY})}>
                            <IconMinorButton
                                icon={<i className={`iconfont icon-tianjia`} style={{fontSize: 22}}/>}
                            />
                        </div>
                    </label>
                    <div>
                        <CustomSearchInput
                            value={searchInfo}
                            onChange={(v) => setSearchInfo(v)}
                        />
                    </div>
                </CustomDragDiv>
                {!searchInfo ? <div
                        className="friend-list-items">
                        {allFriendData.map(item => {
                            return (
                                <CustomAccordion
                                    key={item.groupId}
                                    title={item.name}
                                    titleEnd={`（${item.friends ? item.friends.length : 0}）`}
                                    onContextMenu={(e) => {
                                        setGroupRightOptionsFilter(item.isCustom ? [""] : ["modifyGroup", "deleteGroup"])
                                        selectedGroupId.current = item.groupId
                                        setGroupUpdateInfo(item.name)
                                        setGroupMenuPosition({x: e.clientX, y: e.clientY})
                                    }}
                                >
                                    {item?.friends?.map((friend) => {
                                        return (
                                            <div key={friend.friendId}>
                                                <FriendCard
                                                    info={friend}
                                                    onClick={() => onFriendDetails(friend.friendId)}
                                                />
                                            </div>
                                        )
                                    })}
                                </CustomAccordion>
                            )
                        })}
                    </div>
                    :
                    <div className="friend-list-items">
                        {searchFriendsList.length > 0 ?
                            <div>
                                {
                                    searchFriendsList.map((friend) => {
                                        return (
                                            <FriendSearchCard
                                                info={friend}
                                                onClick={() => onSendMsgClick(friend.friendId)}
                                            />
                                        )
                                    })
                                }
                            </div>
                            : <CustomEmpty/>
                        }
                    </div>
                }
            </div>
            {
                friendDetails ?
                    <CustomDragDiv className="friend-content">
                        <div className="friend-content-container">
                            <div className="friend-content-container-top">
                                <div className="friend-content-container-top-info">
                                    <img
                                        onClick={() => CreateImageViewer(getFileNameAndType(friendDetails.portrait).fileName, friendDetails.portrait)}
                                        className="info-icon"
                                        src={friendDetails.portrait}
                                        alt={friendDetails.portrait}
                                    />
                                    <div className="info-content">
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            <div style={{
                                                fontSize: 30,
                                                fontWeight: 600,
                                                letterSpacing: 2
                                            }}>{friendDetails.name}</div>
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                {friendDetails.isConcern &&
                                                    <i className={`iconfont icon-star`}
                                                       style={{fontSize: 22, color: "#4C9BFF"}}/>
                                                }
                                                <IconMinorButton
                                                    onClick={(e) => {
                                                        setMoreRightOptionsFilter(friendDetails.isConcern ? ["careFor"] : ["unCaraFor"])
                                                        setMoreMenuPosition({x: e.clientX, y: e.clientY})
                                                    }}
                                                    icon={<i className={`iconfont icon-gengduo`}
                                                             style={{fontSize: 32}}/>}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{
                                                fontSize: 16,
                                                color: "#989898"
                                            }}>账号：{friendDetails.account}</div>
                                            <div style={{height: 16}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="friend-content-container-mid">
                                <div className="info-item">
                                    <i className={`iconfont ${friendDetails.sex === '女' ? 'icon-nv' : 'icon-nan'}`}
                                       style={{
                                           fontSize: 14,
                                           marginRight: 5,
                                           color: friendDetails.sex === '女' ? "#FFA0CF" : "#4C9BFF"
                                       }}/>
                                    <div>{friendDetails.sex}</div>
                                    <CustomLine size={12} width={1} direction="vertical"/>
                                    <div>{calculateAge(friendDetails.birthday)}岁</div>
                                    <CustomLine size={12} width={1} direction="vertical"/>
                                    <div>{getDateDayAndMonth(friendDetails.birthday)}</div>
                                </div>
                                <div className="info-item">
                                    <i className={`iconfont icon-beizhu`} style={{fontSize: 14, marginRight: 5}}/>
                                    <div className="flex-shrink">备注：</div>
                                    <CustomEditableText
                                        placeholder="设置好友备注"
                                        text={friendDetails.remark}
                                        onSave={(v) => onSetRemark(friendDetails.friendId, v)}
                                    />
                                </div>
                                <div className="info-item">
                                    <i className={`iconfont icon-fenzu`} style={{fontSize: 14, marginRight: 5}}/>
                                    <div className="flex-shrink">分组：</div>
                                    <CustomDropdown
                                        options={groupList}
                                        defaultValue={friendDetails.groupName ? friendDetails.groupName : "未分组"}
                                        onSelect={(option) => onSetGroup(friendDetails.friendId, option)}
                                    />
                                </div>
                                <div className="info-item">
                                    <i className={`iconfont icon-qianming`} style={{fontSize: 14, marginRight: 5}}/>
                                    <div className="flex-shrink">签名：</div>
                                    <div>{friendDetails.signature}</div>
                                </div>
                                <div className="info-item">
                                    <div style={{display: "flex", flexDirection: "column"}}>
                                        <div style={{display: "flex"}}>
                                            <i className={`iconfont icon-pengyouquan`}
                                               style={{fontSize: 14, marginRight: 5}}/>
                                            <div className="flex-shrink">朋友圈：</div>
                                        </div>
                                        <div
                                            onClick={() => {
                                                h.push("/home/talk")
                                            }}
                                        >
                                            <div>今天天气不错！</div>
                                            <div style={{width: 100, height: 100}}>
                                                <img
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        borderRadius: 5
                                                    }}
                                                    src="https://th.bing.com/th/id/OIP.kt5NiXbTpov01ELs6cs8tQHaEo?rs=1&pid=ImgDetMain"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="friend-content-container-bottom">
                                <div style={{display: "flex"}}>
                                    <CustomButton
                                        type=""
                                        width={100}
                                        onClick={() => onSendMsgClick(selectedFriendId)}
                                    >
                                        发消息
                                    </CustomButton>
                                    <CustomButton type="minor" width={100}>视频聊天</CustomButton>
                                </div>
                            </div>
                        </div>
                    </CustomDragDiv>
                    :
                    <CustomDragDiv style={{display: "flex", flex: 1, alignItems: "center", justifyContent: "center"}}>
                        <img style={{height: 120}} src="/bg.png" alt=""/>
                    </CustomDragDiv>
            }
        </div>)
}