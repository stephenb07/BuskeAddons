import Settings from "../Amaterasu/core/Settings"
import DefaultConfig from "../Amaterasu/core/DefaultConfig"

const version = JSON.parse(FileLib.read("BuskeAddons", "metadata.json")).version

const CHANGELOG = `# §bBuskeAddons v${version}\n ${FileLib.read("BuskeAddons", "changelog.md")}`
const CREDITS = FileLib.read("BuskeAddons", "CREDIT.md")

const defaultConf = new DefaultConfig("BuskeAddons", "data/settings.json")

defaultConf
    .addButton({
        category: "General",
        configName: "MyDiscord",
        title: "Discord Server",
        description: "Join if you want to report a bug or want to make a suggestion",
        onClick(setting) {
            ChatLib.command("ct copy https://discord.gg/YourDiscordLink", true)
            ChatLib.chat("&6Copied Discord Link!")
        }
    })
    .addSwitch({
        category: "Mining",
        configName: "miningSpeedBoostAlert",
        title: "Mining Speed Boost Alert",
        description: "Play a sound when Mining Speed Boost is available"
    })
    .addSwitch({
        category: "Exploration",
        configName: "fairySoulCounter",
        title: "Fairy Soul Counter",
        description: "Count and display found Fairy Souls (max 247)"
    })
    .addColorPicker({
        category: "GUI",
        configName: "bgColor",
        title: "Change Background Color",
        description: "Changes the color and alpha of the background",
        value: [0, 0, 0, 80]
    })
    .addSlider({
        category: "GUI",
        configName: "x",
        title: "Change X",
        description: "Changes the starting X coordinate of the GUI (in percent)",
        options: [0, 75],
        value: 20
    })
    .addSlider({
        category: "GUI",
        configName: "y",
        title: "Change Y",
        description: "Changes the starting Y coordinate of the GUI (in percent)",
        options: [0, 75],
        value: 20
    })
    .addSlider({
        category: "GUI",
        configName: "width",
        title: "Change Width",
        description: "Changes the width of the GUI (in percent)",
        options: [25, 100],
        value: 60
    })
    .addSlider({
        category: "GUI",
        configName: "height",
        title: "Change Height",
        description: "Changes the height of the GUI (in percent)",
        options: [25, 100],
        value: 60
    })
    .addKeybind({
        category: "Keybinds",
        configName: "openGuiKey",
        title: "Open GUI",
        description: "Keybind to open the BuskeAddons GUI"
    })
    .addKeybind({
        category: "Keybinds",
        configName: "toggleFairySoulsKey",
        title: "Toggle Fairy Souls Counter",
        description: "Keybind to toggle the Fairy Souls Counter"
    })
    .addKeybind({
        category: "Keybinds",
        configName: "copyPurseKey",
        title: "Copy Purse To Clipboard",
        description: "Keybind to copy the current purse value to clipboard"
    })

const config = new Settings("BuskeAddons", defaultConf, "data/ColorScheme.json")
    .setCommand("buskeaddons", ["ba", "b"])
    .addMarkdown("Changelog", CHANGELOG)
    .addMarkdown("Credits", CREDITS)
    .onOpenGui(() => {
        ChatLib.chat("BuskeAddons config GUI has been opened")
    })
    .onCloseGui(() => {
        ChatLib.chat("BuskeAddons config GUI has been closed")
    })

config
    .setPos(config.settings.x, config.settings.y)
    .setSize(config.settings.width, config.settings.height)
    .setScheme("data/ColorScheme.json")
    .apply()

export default () => config.settings