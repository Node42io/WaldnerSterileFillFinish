import { SearchBar, ThemeToggle } from '@node42/ui-kit'
import { GlossaryButton } from './Glossary'
import { HelpButton } from './About'

// Trailing navbar actions shared by every report page. Mirrors the kit's
// default actions (theme toggle + help) but slots the global Glossary entry
// point between them — grouped with the other reading aids. The help button
// opens the "About Node42" modal. The xs search bar sits to the left of the
// theme toggle.
export function ReportActions() {
  return (
    <>
      <SearchBar size="xs" placeholder="Search report" />
      <ThemeToggle />
      <GlossaryButton />
      <HelpButton />
    </>
  )
}

export default ReportActions
