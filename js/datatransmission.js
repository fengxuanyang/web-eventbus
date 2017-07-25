 function getHOMEKeyCmd() {
     return getKeyInputRequest(proto.airsync.KeyCode.HOME)
 }

 function getPOWERKeyCmd() {
     return getKeyInputRequest(proto.airsync.KeyCode.POWER)
 }

 function getPlusKeyCmd() {
     return getKeyInputRequest(proto.airsync.KeyCode.VOLUME_UP)
 }


 function getOkKeyCmd() {
     return getKeyInputRequest(proto.airsync.KeyCode.OK)
 }

 function getMinusKeyCmd() {
     return getKeyInputRequest(proto.airsync.KeyCode.VOLUME_DOME)
 }

 function getUpwardKeyCmd() {
     return getKeyInputRequest(proto.airsync.KeyCode.UPWARD)
 }

 function getDownwardKeyCmd() {
     return getKeyInputRequest(proto.airsync.KeyCode.DOWNWARD)
 }

 function getLeftKeyCmd() {
     return getKeyInputRequest(proto.airsync.KeyCode.TOLEFT)
 }

 function getRightKeyCmd() {
     return getKeyInputRequest(proto.airsync.KeyCode.TORIGHT)
 }

 function getMenuKeyCmd() {
     return getKeyInputRequest(proto.airsync.KeyCode.MENU)
 }

 function getBackKeyCmd() {
     return getKeyInputRequest(proto.airsync.KeyCode.BACK)
 }

 function getFlieManagerCmd() {

     var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_FILE_MANAGER);
     var baserequest = new proto.airsync.BaseRequest();
     var baserequestBytes = baserequest.serializeBinary();
     var result = cmdIdBytes;
     for (i = 0; i < baserequestBytes.length; i++) {
         result.push(baserequestBytes[i]);
     }
     showResult("getFlieManagerCmd", result);
     return result;
 }

 function getProjectIP() {
     var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_IP);
     var baserequest = new proto.airsync.BaseRequest();
     var baserequestBytes = baserequest.serializeBinary();
     var result = cmdIdBytes;
     for (i = 0; i < baserequestBytes.length; i++) {
         result.push(baserequestBytes[i]);
     }
     showResult("getIpReqCmd", result);
     return result;
 }

 function getWifiScanCmd() {
     var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_WIFI);
     var wifiRequest = new proto.airsync.WifiRequest();

     var baserequest = new proto.airsync.BaseRequest();
     wifiRequest.setBaserequest(baserequest);
     wifiRequest.setOperation(proto.airsync.WifiOperation.SCAN);

     var wifiRequestBytes = wifiRequest.serializeBinary();
     var result = cmdIdBytes;
     for (i = 0; i < wifiRequestBytes.length; i++) {
         result.push(wifiRequestBytes[i]);
     }
     showResult("getWifiScanCmd", result);
     return result;
 }

 function getWifiConnectCmd(networkId, password) {
     var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_WIFI);
     var wifiRequest = new proto.airsync.WifiRequest();
     var baserequest = new proto.airsync.BaseRequest();
     wifiRequest.setBaserequest(baserequest);
     wifiRequest.setOperation(proto.airsync.WifiOperation.CONNECT);
     wifiRequest.setNetworkid(networkId);
     if (password) {
         wifiRequest.setPassword(password);
     }
     var wifiRequestBytes = wifiRequest.serializeBinary();
     var result = cmdIdBytes;
     for (i = 0; i < wifiRequestBytes.length; i++) {
         result.push(wifiRequestBytes[i]);
     }
     showResult("getWifiConnectCmd", result);
     return result;
 }

 function getWifiForgetCmd(networkId) {
     var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_WIFI);
     var wifiRequest = new proto.airsync.WifiRequest();
     var baserequest = new proto.airsync.BaseRequest();
     wifiRequest.setBaserequest(baserequest);
     wifiRequest.setOperation(proto.airsync.WifiOperation.FORGET);
     wifiRequest.setNetworkid(networkId);
     var wifiRequestBytes = wifiRequest.serializeBinary();
     var result = cmdIdBytes;
     for (i = 0; i < wifiRequestBytes.length; i++) {
         result.push(wifiRequestBytes[i]);
     }
     showResult("getWifiForgetCmd", result);
     return result;
 }

 function getReqScreenSyncCmd() {
     var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_SCREEN_SYNC);
     var result = appendBaseRequestBytes(cmdIdBytes);
     showResult("getReqScreenSyncCmd", result);
     return result;
 }


 function appendBaseRequestBytes(currentBytes) {
     var baserequest = new proto.airsync.BaseRequest();
     var baserequestBytes = baserequest.serializeBinary();
     for (i = 0; i < baserequestBytes.length; i++) {
         currentBytes.push(baserequestBytes[i]);
     }
     return currentBytes;
 }
 function getKeyInputRequest(keyCode) {
     var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_KEY_INPUT);
     var baserequest = new proto.airsync.BaseRequest();
     var keyinput = new proto.airsync.KeyInputRequest();
     keyinput.setBaserequest(baserequest);
     keyinput.setCode(keyCode);
     var keyInputBytes = keyinput.serializeBinary();
     var result = cmdIdBytes;
     for (i = 0; i < keyInputBytes.length; i++) {
         result.push(keyInputBytes[i]);
     }
     return result;
 }

 function getTextInputRequest(text) {
     var cmdIdBytes = intToBytes(proto.airsync.CmdId.REQ_TEXT_INPUT);
     var baserequest = new proto.airsync.BaseRequest();
     var textinput = new proto.airsync.TextInputRequest();
     textinput.setBaserequest(baserequest);
     textinput.setText(text);
     var textInputBytes = textinput.serializeBinary();
     var result = cmdIdBytes;
     for (i = 0; i < textInputBytes.length; i++) {
         result.push(textInputBytes[i]);
     }
     return result;
 }



 function getResponseFromBase64(base64Str) {
     var receiveRawData = base64ToArrayBuffer(base64Str);
     var cmdIdRawData = receiveRawData.slice(0, 2);
     var cmdCode = bytes2Int(cmdIdRawData);
     var responseDataRawData = receiveRawData.slice(2);
     showResult("getResponseFromBase64", "cmdCode:" + cmdCode);
     var responsedata;
     if (cmdCode === proto.airsync.CmdId.RESP_KEY_INPUT) {
         responsedata = proto.airsync.BaseResponse.deserializeBinary(responseDataRawData);
     }
     if (cmdCode === proto.airsync.CmdId.RESP_TEXT_INPUT) {
         responsedata = proto.airsync.BaseResponse.deserializeBinary(responseDataRawData);
     }
     if (cmdCode === proto.airsync.CmdId.PUSH_EDIT_FOCUS_CHANGE) {
         responsedata = proto.airsync.EditFocusChangePush.deserializeBinary(responseDataRawData);
     }
     if (cmdCode === proto.airsync.CmdId.REQ_KEY_INPUT) {
         responsedata = proto.airsync.KeyInputRequest.deserializeBinary(responseDataRawData);
     }
     if (cmdCode === proto.airsync.CmdId.RESP_FILE_MANAGER) {
         responsedata = proto.airsync.FileManagerResponse.deserializeBinary(responseDataRawData);
     }
     if (cmdCode === proto.airsync.CmdId.RESP_WIFI) {
         responsedata = proto.airsync.WifiResponse.deserializeBinary(responseDataRawData);
     }
     if (cmdCode === proto.airsync.CmdId.RESP_IP) {
         responsedata = proto.airsync.IpResponse.deserializeBinary(responseDataRawData);
     }
     showResult("getResponseFromBase64", "responsedata:" + responsedata);
     return responsedata;
 }
