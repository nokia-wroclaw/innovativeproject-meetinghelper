package com.toast;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import android.widget.Toast;
import android.app.Activity;
import android.content.Context;

public class ToastPlugin extends CordovaPlugin {

	private static final String TAG = "ToastPlugin";
	private static final String LONG_TOAST_ACTION = "show_long";
	private static final int TOAST_MESSAGE_INDEX = 0;

	@Override
	public boolean execute(String action, JSONArray data, CallbackContext callbackId) {
		String toastMessage;
		try {
			toastMessage = data.getString(TOAST_MESSAGE_INDEX);
		} catch (JSONException e) {
			Log.e(TAG, "Required parameter 'Toast Message' missing");
			return false;
		}
		Activity activity = cordova.getActivity();
		if (action.equals(LONG_TOAST_ACTION)) {
		  activity.runOnUiThread(new RunnableToast(toastMessage, Toast.LENGTH_LONG));
		} else {
		  activity.runOnUiThread(new RunnableToast(toastMessage, Toast.LENGTH_SHORT));
		}

		return true;
	}

	class RunnableToast implements Runnable {
		private String message;
		private int length;

		Context context =  cordova.getActivity().getApplicationContext();
		public RunnableToast(String message, int length) {
			this.message = message;
			this.length = length;
		}

		@Override
		public void run() {
			Toast.makeText(context, message, length).show();
		}

	}

}