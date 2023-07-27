---
title: "Setting up flutter environment in Linux"
date: 2022-03-19 00:00:00 -0600
head:
    - - meta
      - name: description
        content: Setting up flutter environment
    - - meta
      - property: og:image
        content: /assets/img/2022-03-19-flutter-linux/header.png
---

# Setting up flutter environment in Linux

## Setting up flutter environment in Linux

If you try to set up an Flutter environment, you must read in the [official documentation](https://docs.flutter.dev/get-started/install/linux#install-android-studio) suggest that get the best development experience it's recommended install Android Studio.

This is my approach to get a full `Flutter` environment only with CLI tools.

## Get Flutter

Firs to all, we need to get Flutter and set-up environment variables.

> I used `~/.bin/flutter` folder as main flutter root.

```bash
# pwd: ~/.bin/
git clone https://github.com/flutter/flutter.git -b stable
```

Now, set `flutter/bin` dir permanetly to shell `PATH`.

> NOTE: In my scenario, I used [Fish Shell](https://fishshell.com/). So, that's the way to set a new environment variable on it.

```bash
set -U fish_user_paths ~/.bin/flutter/bin
```

After that, we need to get some platform tools.

```bash
flutter precache
```

If you don't see any error at this point, `flutter` and `dart` have been installed correctly.

Now, run `flutter doctor`, and some errors occurs. That's ok!

```bash
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 2.10.3, on Debian GNU/Linux 10 (buster) 4.19.0-19-amd64, locale en_US.UTF-8)
[✗] Android toolchain - develop for Android devices
    ✗ cmdline-tools component is missing
      Run `path/to/sdkmanager --install "cmdline-tools;latest"`
      See https://developer.android.com/studio/command-line for more details.
[✗] Chrome - develop for the web (Cannot find Chrome executable at google-chrome)
    ! Cannot find Chrome. Try setting CHROME_EXECUTABLE to a Chrome executable.
[!] Android Studio (not installed)
[✓] VS Code (version 1.65.2)
[!] Connected device
    ! No devices available
[✓] HTTP Host Availability

! Doctor found issues in 4 categories.
```

## Android toolchain

> NOTE: with flutter 2.10.\* you need `android-29` API version.

Flutter SDK needs Android 4.1 (API level 16) or higher to works correctly.

Create a root dir to Android environment setup.

```bash
mkdir ~/.android && cd .android
```

Now get Android command line tools.

```bash
# pwd: ~/.android/
curl https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip -o cmd_line.zip && unzip cmd_line.zip
rm -rf *.zip
```

Now, we need to move all files to new nested folder called `latest`.

> NOTE: this step is required 'cause when `sdkmanager` command is running, by default works with a sub-folder inside of `cmdline-tools/` folder. Some like this: `cmdline-tools/{latest | version.N.N }/`

```bash
# pwd: ~/.android/
mkdir ./cmdline-tools/latest
rsync -arv --exclude=./cmdline-tools/latest ./cmdline-tools/* ./cmdline-tools/latest/
rm -rf (string match -rv '^./cmdline-tools/latest/*$' -- ./cmdline-tools/*)
```

Add `cmdline-tools/latest/bin` to shell path.

```bash
set -U fish_user_paths ~/.android/cmdline-tools/latest/bin
```

Set Android SDK path on flutter global configuration.

```bash
flutter config --android-sdk /home/{USER}/.android/
```

Get build and platform tools.

> NOTE: latest stable version of `build tools` is 32.0.0.

```bash
sdkmanager --install "build-tools;32.0.0"
```

Now, get the latest version of platform tools.

```bash
sdkmanager --install "platform-tools"
```

At this point, is mandatory add another dir to shell path.

```bash
set -U fish_user_paths ~/.android/platform-tools
```

> NOTE: in flutter 2.10.\* and higher is mandatory used `android-29` platform version.

```bash
sdkmanager --install "platforms;android-29"
```

After that, accept all Android licenses.

```bash
flutter doctor --android-licences
```

## Android emulator

I strongly recommend use [Genymotion](https://docs.genymotion.com/desktop/), it's reliable and more lighter than `qemu` emulator.
