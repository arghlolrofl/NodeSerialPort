param([string]$Source, [string]$Dest)

# Either use folders as parameter or define them here
# Source Folder
#$pathDeploySource = "D:\projects\NavigatorWeb\src\NavigatorWeb.Node\bin\ARM\Debug\AppX\"
# Destination Folder
#$pathDeployDest = "W:\"

robocopy "$($Source)" "$($Dest)" /MIR /NC /NP /NS /NDL /ETA /XF "vs.appxrecipe" ".gitignore"
