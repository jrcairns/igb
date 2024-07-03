import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import '../styles/globals.css';
import { Theme } from '@/components/theme-provider';
import { Query } from '@/components/query-provider';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning lang="en">
        <body>
          <Theme>
            <Query>
              <header className='h-14 flex items-center px-4'>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </header>
              <main>
                {children}
              </main>
            </Query>
          </Theme>
        </body>
      </html>
    </ClerkProvider>
  )
}