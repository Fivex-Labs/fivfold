"use client"

import { useState } from "react"
import { Sun, Moon, Maximize2, ChevronDown } from "lucide-react"
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  EmailVerification,
  AuthProvider,
} from "@/components/ui/kits/auth"
import {
  mergeThemeVars,
  BASE_COLOR_OPTIONS,
  COLOR_THEME_OPTIONS,
} from "../_data/shadcn-themes"
import { ScreenSwitcher, type AuthScreen } from "./screen-switcher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DevicePreview } from "../../../components/device-preview"

const SHADCN_FONT =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

const DEMO_LOGO = "/logos/logomark_dark_transparent.png"
const DEMO_APP_NAME = "Acme Inc"

export function AuthDemo() {
  const [mode, setMode] = useState<"light" | "dark">("dark")
  const [baseColor, setBaseColor] = useState("neutral")
  const [colorTheme, setColorTheme] = useState("default")
  const [screen, setScreen] = useState<AuthScreen>("login")
  const [previewOpen, setPreviewOpen] = useState(false)

  const themeVars = mergeThemeVars(baseColor, colorTheme, mode)
  const styleObj = {
    ...themeVars,
    fontFamily: SHADCN_FONT,
  } as React.CSSProperties

  const oauthProviders: ("google" | "github" | "apple")[] = ["google", "github", "apple"]

  const sharedLayoutProps = {
    logoSrc: DEMO_LOGO,
    appName: DEMO_APP_NAME,
    termsHref: "#",
    privacyHref: "#",
  }

  const renderScreen = (forceLayout?: "mobile" | "desktop") => {
    switch (screen) {
      case "login":
        return (
          <LoginForm
            onForgotPassword={() => setScreen("forgot-password")}
            oauthProviders={oauthProviders}
            forceLayout={forceLayout}
            footerContent={
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline underline-offset-2 hover:no-underline"
                  onClick={() => setScreen("register")}
                >
                  Sign up
                </button>
              </p>
            }
            {...sharedLayoutProps}
          />
        )
      case "register":
        return (
          <RegisterForm
            oauthProviders={oauthProviders}
            forceLayout={forceLayout}
            footerContent={
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline underline-offset-2 hover:no-underline"
                  onClick={() => setScreen("login")}
                >
                  Sign in
                </button>
              </p>
            }
            {...sharedLayoutProps}
          />
        )
      case "forgot-password":
        return (
          <ForgotPasswordForm
            onBackToLogin={() => setScreen("login")}
            forceLayout={forceLayout}
            {...sharedLayoutProps}
          />
        )
      case "reset-password":
        return (
          <ResetPasswordForm
            token="demo-token"
            onBackToLogin={() => setScreen("login")}
            forceLayout={forceLayout}
            {...sharedLayoutProps}
          />
        )
      case "email-verification":
        return (
          <EmailVerification
            onBackToLogin={() => setScreen("login")}
            forceLayout={forceLayout}
            {...sharedLayoutProps}
          />
        )
      default:
        return (
          <LoginForm
            oauthProviders={oauthProviders}
            forceLayout={forceLayout}
            {...sharedLayoutProps}
          />
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          {mode === "light" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                Base: {BASE_COLOR_OPTIONS.find((o) => o.id === baseColor)?.label ?? baseColor}
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent align="start">
            {BASE_COLOR_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.id}
                onClick={() => setBaseColor(opt.id)}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                Color: {COLOR_THEME_OPTIONS.find((o) => o.id === colorTheme)?.label ?? colorTheme}
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
            {COLOR_THEME_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.id}
                onClick={() => setColorTheme(opt.id)}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPreviewOpen(true)}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Maximize2 className="h-4 w-4" />
          <span className="ml-2">Open Device Simulation</span>
        </Button>
      </div>

      <ScreenSwitcher active={screen} onSwitch={setScreen} />

      <div className={mode === "dark" ? "dark" : ""} style={styleObj}>
        <div
          className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-white/10 p-6"
          style={{
            color: "var(--foreground)",
            backgroundColor: "var(--background)",
          }}
        >
          <AuthProvider>{renderScreen()}</AuthProvider>
        </div>
      </div>

      <DevicePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        mode={mode}
        baseColor={baseColor}
        colorTheme={colorTheme}
        onModeChange={setMode}
        onBaseColorChange={setBaseColor}
        onColorThemeChange={setColorTheme}
        themeVars={themeVars}
        fontFamily={SHADCN_FONT}
      >
        {(_, deviceSize) => (
          <div className="flex min-h-full items-center justify-center p-6">
            <AuthProvider>
              {renderScreen(deviceSize === "mobile" ? "mobile" : undefined)}
            </AuthProvider>
          </div>
        )}
      </DevicePreview>
    </div>
  )
}
