# Create simple PNG icons for KCET Coded
# This script creates basic PNG icons using PowerShell

$sizes = @(96, 144, 192, 512)

foreach ($size in $sizes) {
    # Create a simple blue square with "KC" text
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Set high quality
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    
    # Create gradient background
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(59, 130, 246), [System.Drawing.Color]::FromArgb(29, 78, 216), 45)
    $graphics.FillRectangle($brush, $rect)
    
    # Add rounded corners effect
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, $size/5, $size/5, 180, 90)
    $path.AddArc($size - $size/5, 0, $size/5, $size/5, 270, 90)
    $path.AddArc($size - $size/5, $size - $size/5, $size/5, $size/5, 0, 90)
    $path.AddArc(0, $size - $size/5, $size/5, $size/5, 90, 90)
    $path.CloseAllFigures()
    
    $graphics.SetClip($path)
    $graphics.FillRectangle($brush, $rect)
    $graphics.ResetClip()
    
    # Add "KC" text
    $font = New-Object System.Drawing.Font("Arial", [int]($size * 0.4), [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    $graphics.DrawString("KC", $font, $textBrush, $size/2, $size/2, $format)
    
    # Save as PNG
    $filename = "public\icon-$($size)x$($size).png"
    $bitmap.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    
    Write-Host "Created $filename"
    
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $textBrush.Dispose()
    $font.Dispose()
}

Write-Host "All icons created successfully!"
