import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface OpenWindowDto {
  url: string;
  width?: number;
  height?: number;
}

@Controller('window-manager')
@UseGuards(JwtAuthGuard)
export class WindowManagerController {
  @Post('open-on-primary-monitor')
  async openOnPrimaryMonitor(@Body() dto: OpenWindowDto) {
    const { url, width = 1000, height = 800 } = dto;

    try {
      // Linux için Chrome/Chromium'u birincil monitörde aç
      // --window-position=0,0 birincil monitörün sol üst köşesi
      // --new-window yeni pencere aç
      const command = `DISPLAY=:0 google-chrome --new-window --window-position=0,50 --window-size=${width},${height} "${url}" > /dev/null 2>&1 &`;

      await execAsync(command);

      return {
        success: true,
        message: 'Pencere birincil monitörde açıldı',
      };
    } catch (error) {
      // Chrome yoksa Chromium dene
      try {
        const command = `DISPLAY=:0 chromium-browser --new-window --window-position=0,50 --window-size=${width},${height} "${url}" > /dev/null 2>&1 &`;
        await execAsync(command);

        return {
          success: true,
          message: 'Pencere birincil monitörde açıldı (Chromium)',
        };
      } catch (chromiumError) {
        // Firefox dene
        try {
          const command = `DISPLAY=:0 firefox --new-window --width ${width} --height ${height} "${url}" > /dev/null 2>&1 &`;
          await execAsync(command);

          return {
            success: true,
            message: 'Pencere birincil monitörde açıldı (Firefox)',
          };
        } catch (firefoxError) {
          return {
            success: false,
            message: 'Tarayıcı açılamadı. Chrome, Chromium veya Firefox yüklü değil.',
            error: firefoxError.message,
          };
        }
      }
    }
  }
}
